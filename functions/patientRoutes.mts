import { Router, Request, Response } from "express";
import pool from "./database.mts";
import multer from "multer";
import nodemailer from "nodemailer";

const router = Router();

router.get("/", (req: Request, res: Response): void => {
  res.status(200).send(JSON.stringify("Patient route"));
  return;
});

router.post("/add", async (req: Request, res: Response): Promise<any> => {
  const {
    fullname,
    sex,
    ethnicity,
    age,
    bmi,
    height,
    weight,
    bmicategory,
    agegroup,
  } = req.body;

  if (
    !fullname ||
    sex === undefined ||
    ethnicity === undefined ||
    age === undefined ||
    bmi === undefined ||
    height === undefined ||
    weight === undefined ||
    bmicategory === undefined ||
    agegroup === undefined
  ) {
    return res.status(400).json({
      message: "Missing required patient fields.",
    });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO patient (
        fullname,
        sex,
        ethnicity,
        age,
        height,
        weight,
        bmi,
        bmicategory,
        agegroup
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING 
        patientid,
        fullname,
        sex,
        ethnicity,
        age,
        height,
        weight,
        bmi,
        bmicategory,
        agegroup,
        hasform;
      `,
      [
        fullname,
        sex,
        ethnicity,
        age,
        height,
        weight,
        bmi,
        bmicategory,
        agegroup,
      ]
    );

    return res.status(201).json({
      message: "Patient added successfully",
      patient: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding patient:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.put("/edit", async (req: Request, res: Response): Promise<any> => {
  const {
    patientid,
    fullname,
    sex,
    ethnicity,
    age,
    bmi,
    height,
    weight,
    bmicategory,
    agegroup,
  } = req.body;

  if (!patientid) {
    return res.status(400).json({
      message: "Patient ID is required.",
    });
  }

  if (
    !fullname ||
    sex === undefined ||
    ethnicity === undefined ||
    age === undefined ||
    bmi === undefined ||
    height === undefined ||
    weight === undefined ||
    bmicategory === undefined ||
    agegroup === undefined
  ) {
    return res.status(400).json({
      message: "Missing required patient fields.",
    });
  }

  try {
    const result = await pool.query(
      `
      UPDATE patient
      SET
        fullname = $1,
        sex = $2,
        ethnicity = $3,
        age = $4,
        height = $5,
        weight = $6,
        bmi = $7,
        bmicategory = $8,
        agegroup = $9
      WHERE patientid = $10
      RETURNING
        patientid,
        fullname,
        sex,
        ethnicity,
        age,
        height,
        weight,
        bmi,
        bmicategory,
        agegroup,
        hasform;
      `,
      [
        fullname,
        sex,
        ethnicity,
        age,
        height,
        weight,
        bmi,
        bmicategory,
        agegroup,
        patientid,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Patient not found.",
      });
    }

    return res.status(200).json({
      message: "Patient updated successfully",
      patient: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating patient:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Define expected request body interface
interface AddPatientRequest {
  fullname: string;
  sex: number;
  ethnicity: number;
  age: number;
  height: number;
  weight: number;
  bmi: number;
  bmicategory: number;
  agegroup: number;
}

router.get("/searchByName", async (req: Request, res: Response) => {
  const { name, page = 1, limit = 10 } = req.query;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Valid name parameter is required" });
  }

  try {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const offset = (pageNumber - 1) * limitNumber;

    const result = await pool.query(
      `SELECT * 
       FROM patient 
       WHERE fullname ILIKE $1
       ORDER BY patientid DESC
       LIMIT $2 OFFSET $3`,
      [`%${name}%`, limitNumber, offset]
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) 
       FROM patient 
       WHERE fullname ILIKE $1`,
      [`%${name}%`]
    );

    const totalPatients = Number(countResult.rows[0].count);
    const totalPages = Math.ceil(totalPatients / limitNumber);

    res.status(200).json({
      patients: result.rows,
      totalPatients,
      totalPages,
      currentPage: pageNumber,
      message:
        result.rows.length === 0
          ? "No patients found with the given name"
          : "Patients found",
    });
  } catch (error) {
    console.error("Error searching patients by name:", error);
    res.status(500).json({ message: "Error searching patients by name", error });
  }
});


router.get("/filter", async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    sex,
    ethnicity,
    age,
    bmicategory,
  } = req.query;

  try {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const offset = (pageNumber - 1) * limitNumber;

    const values: (string | number)[] = [];
    let conditionIndex = 1;

    let query = `SELECT p.* FROM patient p WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) FROM patient p WHERE 1=1`;

    // Sex filter
    if (sex !== undefined && sex !== "") {
      query += ` AND p.sex = $${conditionIndex}`;
      countQuery += ` AND p.sex = $${conditionIndex}`;
      values.push(Number(sex));
      conditionIndex++;
    }

    // Ethnicity filter
    if (ethnicity !== undefined && ethnicity !== "") {
      query += ` AND p.ethnicity = $${conditionIndex}`;
      countQuery += ` AND p.ethnicity = $${conditionIndex}`;
      values.push(Number(ethnicity));
      conditionIndex++;
    }

    // Age group filter
    // 0 = Below 50 years
    // 1 = 50 years and above
    if (age !== undefined && age !== "") {
      query += ` AND p.agegroup = $${conditionIndex}`;
      countQuery += ` AND p.agegroup = $${conditionIndex}`;
      values.push(Number(age));
      conditionIndex++;
    }

    // Full BMI category filter
    // 0 = Low CVD Risk (<23.0)
    // 1 = Moderate CVD Risk (23.0 - 27.4)
    // 2 = High CVD Risk (27.5 - 32.4)
    // 3 = Very high CVD Risk (32.5 - 37.4)
    // 4 = Very very high CVD Risk (37.5+)
    if (bmicategory !== undefined && bmicategory !== "") {
      query += ` AND p.bmicategory = $${conditionIndex}`;
      countQuery += ` AND p.bmicategory = $${conditionIndex}`;
      values.push(Number(bmicategory));
      conditionIndex++;
    }

    const filterValues = [...values];

    query += ` ORDER BY p.patientid DESC LIMIT $${conditionIndex} OFFSET $${conditionIndex + 1}`;
    values.push(limitNumber, offset);

    const result = await pool.query(query, values);
    const countResult = await pool.query(countQuery, filterValues);

    const totalPatients = Number(countResult.rows[0].count);
    const totalPages = Math.ceil(totalPatients / limitNumber);

    res.status(200).json({
      patients: result.rows,
      totalPatients,
      totalPages,
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Error fetching patients", error });
  }
});

// GET /form?patientid=123
router.get("/form", async (req: Request, res: Response) => {
  const { patientid , term } = req.query;
  try {
    const query = `
    SELECT pfr.questionid, pfr.answervalue 
    FROM patientform pf 
    JOIN patientformresponse pfr ON pf.formid = pfr.formid 
    WHERE pf.patientid=$1 AND pf.term=$2
    ORDER BY pfr.questionid
    `;

    const { rows } = await pool.query<{ questionid: number; answervalue: number }>(
    query,
      [Number(patientid), Number(term)]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error searching patient id:", error);
    res.status(500).json({ message: "Error searching patient data", error });
    return;
  }
});


// POST /forms
router.post("/forms", async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { patientid, term = 0, responses } = req.body;
    // responses = [{ questionid: 1, answervalue: 5 }, ...]

    await client.query("BEGIN");

    // 1. Insert new form
    const formResult = await client.query(
      `INSERT INTO patientform (patientid, term)
       VALUES ($1, $2)
       RETURNING formid`,
      [patientid, term]
    );
    const formid = formResult.rows[0].formid;

    // 2. Insert responses
    const responsePromises = responses.map((r) =>
      client.query(
        `INSERT INTO patientformresponse (formid, questionid, answervalue)
         VALUES ($1, $2, $3)`,
        [formid, r.questionid, r.answervalue]
      )
    );
    await Promise.all(responsePromises);

    // 3. Update patient.hasform
    await client.query(
      `UPDATE patient SET hasform = TRUE WHERE patientid = $1`,
      [patientid]
    );

    await client.query("COMMIT");
    res.json({ formid });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Failed to submit form" });
  } finally {
    client.release();
  }
});

router.put("/forms", async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const { patientid, term = 0, responses } = req.body;

    await client.query("BEGIN");

    // 1. Get the existing form
    const formResult = await client.query(
      `SELECT formid 
       FROM patientform 
       WHERE patientid = $1 AND term = $2`,
      [patientid, term]
    );

    if (formResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Form not found." });
    }

    const formid = formResult.rows[0].formid;

    // 2. Update each response
    for (const r of responses) {
      await client.query(
        `UPDATE patientformresponse
         SET answervalue = $1
         WHERE formid = $2 AND questionid = $3`,
        [r.answervalue, formid, r.questionid]
      );
    }

    await client.query("COMMIT");

    res.status(200).json({
      message: "Responses updated successfully",
      formid,
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ message: "Failed to update responses" });
  } finally {
    client.release();
  }
});


// GET /responses?patientid=123&term=0
router.get("/responses", async (req: Request, res: Response) => {
  const { patientid, term } = req.query;

  if (!patientid || term === undefined) {
    return res.status(400).json({ message: "patientid and term are required" });
  }

  try {
    const query = `
      SELECT q.code, r.answervalue
      FROM patientform pf
      JOIN patientformresponse r ON pf.formid = r.formid
      JOIN question q ON r.questionid = q.questionid
      WHERE pf.patientid = $1 AND pf.term = $2
      ORDER BY q.questionid
    `;

    const { rows } = await pool.query(query, [Number(patientid), Number(term)]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No responses found for this patient and term." });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching form responses:", error);
    res.status(500).json({ message: "Failed to fetch form responses", error });
  }
});

router.get("/priority", async (req: Request, res: Response) => {
  const { patientid, term } = req.query;
  if (!patientid || term === undefined) {
    return res.status(400).json({ message: "patientid and term are required" });
  }
  try {
    const query = 
    `SELECT questionid
     FROM patientpriority
     WHERE patientid = $1 AND term = $2
     ORDER BY questionid ASC
     `;

    const { rows } = await pool.query<{ questionid: number }>(query, [Number(patientid), Number(term)]);
    res.status(200).json(rows.map(r => r.questionid));
  } catch (error) {
    console.error("Error fetching priorities:", error);
    res.status(500).json({ message: "Failed to fetch priorities", error });
  }
});

router.post("/priorities", async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { patientid, term, priorities , maxPriorities } = req.body;
    // priorities = [1, 5, 8, 10, 12] (array of questionids)

    if (
      !patientid ||
      term === undefined ||
      !Array.isArray(priorities) ||
      priorities.length > (Number(maxPriorities) || 5)
    ) {
      return res.status(400).json({
        message: `You must provide exactly ${maxPriorities} priorities for this term.`,
      });
    }

    await client.query("BEGIN");

    // Check if priorities already exist for this patient+term
    const existing = await client.query(
      `SELECT COUNT(*) FROM patientpriority WHERE patientid = $1 AND term = $2`,
      [patientid, term]
    );

    if (parseInt(existing.rows[0].count, 10) > 0) {
      await client.query("ROLLBACK");
      return res
        .status(400)
        .json({ message: "Priorities already exist for this term." });
    }

    // Insert exactly 5 new priorities
    for (const qid of priorities) {
      await client.query(
        `INSERT INTO patientpriority (patientid, questionid, term)
         VALUES ($1, $2, $3)`,
        [patientid, qid, term]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Priorities saved successfully",
      patientid,
      term,
      priorities,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error saving priorities:", error);
    res.status(500).json({ message: "Failed to save priorities", error });
  } finally {
    client.release();
  }
});

router.put("/priorities", async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const { patientid, term, priorities, maxPriorities } = req.body;

    if (
      !patientid ||
      term === undefined ||
      !Array.isArray(priorities) ||
      priorities.length > (Number(maxPriorities) || 5)
    ) {
      return res.status(400).json({
        message: `You must provide at most ${maxPriorities || 5} priorities.`,
      });
    }

    const unique = new Set(priorities);
    if (unique.size !== priorities.length) {
      return res.status(400).json({
        message: "Duplicate priorities are not allowed.",
      });
    }

    await client.query("BEGIN");

    // 1️⃣ Ensure form exists (optional but good)
    const formCheck = await client.query(
      `SELECT 1 FROM patientform WHERE patientid = $1 AND term = $2`,
      [patientid, term]
    );

    if (formCheck.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Form not found for this term." });
    }

    // 2️⃣ Delete old priorities
    await client.query(
      `DELETE FROM patientpriority
       WHERE patientid = $1 AND term = $2`,
      [patientid, term]
    );

    // 3️⃣ Insert new priorities
    for (const qid of priorities) {
      await client.query(
        `INSERT INTO patientpriority (patientid, questionid, term)
         VALUES ($1, $2, $3)`,
        [patientid, qid, term]
      );
    }

    await client.query("COMMIT");

    res.status(200).json({
      message: "Priorities updated successfully",
      patientid,
      term,
      priorities,
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating priorities:", error);
    res.status(500).json({ message: "Failed to update priorities" });
  } finally {
    client.release();
  }
});


interface Patient {
  referencepatientid: number;
  age: number;
  sex: number;
  ethnicity: number;
  height: number;
  weight: number;
  bmi: number;
  bmicategory: number;
}

interface FilterType {
  age?: 0 | 1;
  sex?: 0 | 1;
  ethnicity?: 0 | 1;
  bmi?: 0 | 1;
}

// Change this if Chinese is not stored as 0 in your DB
const CHINESE_ETHNICITY_CODE = 0;

const formatConditions = (
  filters: FilterType = {},
  startParamIndex: number
) => {
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  let paramIndex = startParamIndex;

  const addParam = (value: string | number) => {
    params.push(value);
    return `$${paramIndex++}`;
  };

  // Age: 0 = <50, 1 = 50+
  if (filters.age !== undefined) {
    const ageParam = addParam(50);

    if (Number(filters.age) === 0) {
      conditions.push(`p.age < ${ageParam}`);
    } else {
      conditions.push(`p.age >= ${ageParam}`);
    }
  }

  // Gender: 0 = Male, 1 = Female
  if (filters.sex !== undefined) {
    const sexParam = addParam(Number(filters.sex));
    conditions.push(`p.sex = ${sexParam}`);
  }

  // Ethnicity: 0 = Chinese, 1 = Non-Chinese
  if (filters.ethnicity !== undefined) {
    const chineseParam = addParam(CHINESE_ETHNICITY_CODE);

    if (Number(filters.ethnicity) === 0) {
      conditions.push(`p.ethnicity = ${chineseParam}`);
    } else {
      conditions.push(`p.ethnicity <> ${chineseParam}`);
    }
  }

  // BMI: 0 = 32.5–37.4, 1 = 37.5+
  if (filters.bmi !== undefined) {
    if (Number(filters.bmi) === 0) {
      const lowerBmi = addParam(32.5);
      const upperBmi = addParam(37.5);

      conditions.push(`(p.bmi >= ${lowerBmi} AND p.bmi < ${upperBmi})`);
    } else {
      const lowerBmi = addParam(37.5);

      conditions.push(`p.bmi >= ${lowerBmi}`);
    }
  }

  return {
    conditionString: conditions.length > 0 ? conditions.join(" AND ") : "1=1",
    params,
  };
};

router.post("/before", async (req: Request, res: Response) => {
  const { questionid, options, filters } = req.body;

  try {
    const results: { option: string; count: number; percentage: number }[] = [];

    if (
      questionid === undefined ||
      questionid === null ||
      !Array.isArray(options)
    ) {
      res.status(400).json({ message: "Missing required parameters." });
      return;
    }

    // $1 = questionid
    // filter params start from $2
    const filterConditions = formatConditions(filters || {}, 2);

    const conditions = filterConditions.conditionString;

    const queryParams: (string | number)[] = [
      questionid,
      ...filterConditions.params,
    ];

    const totalQuery = `
      SELECT COUNT(rfr.answervalue) AS total
      FROM refformresponse rfr
      JOIN refform f ON rfr.formid = f.formid
      JOIN referencepatient p ON f.referencepatientid = p.referencepatientid
      WHERE rfr.questionid = $1
        AND f.term = 0
        AND ${conditions}
    `;

    const { rows: totalResult } = await pool.query<{ total: string | number }>(
      totalQuery,
      queryParams
    );

    const totalRows = Number(totalResult[0]?.total ?? 0);

    if (totalRows === 0) {
      res.status(200).json({
        message: "No data found for the given filters.",
        totalRows,
        data: [],
      });
      return;
    }

    for (const option of options) {
      if (option === undefined || option === null) continue;

      const optionParamIndex = queryParams.length + 1;

      const query = `
        SELECT COUNT(rfr.answervalue) AS count
        FROM refformresponse rfr
        JOIN refform f ON rfr.formid = f.formid
        JOIN referencepatient p ON f.referencepatientid = p.referencepatientid
        WHERE rfr.questionid = $1
          AND f.term = 0
          AND rfr.answervalue = $${optionParamIndex}
          AND ${conditions}
      `;

      const { rows: optionRows } = await pool.query<{ count: string | number }>(
        query,
        [...queryParams, option]
      );

      const count = Number(optionRows[0]?.count ?? 0);
      const percentage =
        totalRows > 0 ? Math.round((count / totalRows) * 100) : 0;

      results.push({
        option: option.toString(),
        count,
        percentage,
      });
    }

    res.status(200).json({
      message: "Data fetched successfully",
      totalRows,
      data: results,
      questionid,
    });
  } catch (error) {
    console.error("Error fetching data from registry:", error);
    res.status(500).json({
      message: "Error fetching data from registry",
      error,
    });
  }
});


router.post("/after", async (req: Request, res: Response) => {
  const {
    questionid,
    options,
    filters,
    initial,
    term = 1,
    median = false,
  } = req.body;

  try {
    if (
      questionid === undefined ||
      questionid === null ||
      initial === undefined ||
      initial === null ||
      !Array.isArray(options)
    ) {
      res.status(400).json({ message: "Missing required parameters." });
      return;
    }

    const results: {
      option: string;
      count: number;
      percentage: number;
    }[] = [];

    // $1 = initial
    // $2 = questionid
    // filters start from $3
    const filterConditions = formatConditions(filters || {}, 3);

    const conditions = filterConditions.conditionString;

    const baselineParams: (string | number)[] = [
      initial,
      questionid,
      ...filterConditions.params,
    ];

    const baselineQuery = `
      SELECT f.referencepatientid
      FROM refformresponse rfr
      JOIN refform f ON rfr.formid = f.formid
      JOIN referencepatient p ON f.referencepatientid = p.referencepatientid
      WHERE rfr.questionid = $2
        AND f.term = 0
        AND rfr.answervalue = $1
        AND ${conditions}
    `;

    const { rows: baselineRows } = await pool.query<{
      referencepatientid: number;
    }>(baselineQuery, baselineParams);

    const baselinePatientIds = baselineRows.map((r) => r.referencepatientid);

    if (baselinePatientIds.length === 0) {
      res.status(200).json({
        message: "No baseline patients found for the given filters.",
        totalRows: 0,
        data: [],
        questionid,
      });
      return;
    }

    for (const option of options) {
      if (option === undefined || option === null) continue;

      const optionQuery = `
        SELECT COUNT(rfr.answervalue) AS count
        FROM refformresponse rfr
        JOIN refform f ON rfr.formid = f.formid
        WHERE rfr.questionid = $1
          AND f.term = $2
          AND rfr.answervalue = $3
          AND f.referencepatientid = ANY($4::int[])
      `;

      const { rows: optionRows } = await pool.query<{ count: string | number }>(
        optionQuery,
        [questionid, term, option, baselinePatientIds]
      );

      const count = Number(optionRows[0]?.count ?? 0);

      results.push({
        option: option.toString(),
        count,
        percentage: 0,
      });
    }

    const totalCount = results.reduce((sum, r) => sum + Number(r.count), 0);

    for (const r of results) {
      r.percentage =
        totalCount > 0 ? Math.round((Number(r.count) / totalCount) * 100) : 0;
    }

    const responsePayload: any = {
      message: "Data fetched successfully.",
      totalRows: totalCount,
      data: results,
      questionid,
    };

    if (median) {
      const sorted = [...results].sort(
        (a, b) => Number(a.option) - Number(b.option)
      );

      const total = sorted.reduce((sum, r) => sum + Number(r.count), 0);
      const midPoint = total / 2;

      let cumulative = 0;
      let medianValue: number | null = null;

      for (const item of sorted) {
        cumulative += Number(item.count);

        if (cumulative >= midPoint) {
          medianValue = Number(item.option);
          break;
        }
      }

      responsePayload.median = medianValue;
    }

    res.status(200).json(responsePayload);
  } catch (error) {
    console.error("Error fetching data from registry:", error);
    res.status(500).json({
      message: "Error fetching data from registry.",
      error,
    });
  }
});


router.get("/priorities/:patientid/:term", async (req: Request, res: Response) => {
  const { patientid, term } = req.params;

  try {
    const result = await pool.query(
      `SELECT q.questionid, q.code, q.text
       FROM patientpriority pp
       JOIN question q ON pp.questionid = q.questionid
       WHERE pp.patientid = $1 AND pp.term = $2`,
      [patientid, term]
    );

    res.status(200).json({ patientid, term, priorities: result.rows });
  } catch (error) {
    console.error("Error fetching priorities:", error);
    res.status(500).json({ message: "Failed to fetch priorities", error });
  }
});

router.delete(
  "/delete/:id",
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        `DELETE FROM patient WHERE patientid = $1 RETURNING *;`,
        [id]
      );

      if (result.rowCount === 0) {
        return res
          .status(404)
          .json({ message: "Patient not found or already deleted." });
      }

      res.status(200).json({
        message: "Patient deleted successfully",
        deletedPatient: result.rows[0],
      });
    } catch (error) {
      console.error("Error deleting patient:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  }
);

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

router.post("/send-report", upload.single("file"), async (req, res) => {
  try {
    const { email } = req.body;
    const pdfBuffer = req.file?.buffer;

    if (!email || !pdfBuffer) {
      return res.status(400).json({ message: "Missing email or PDF" });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Precede TKA" <${process.env.EMAIL_USER}>`,
      to: email,
      cc: req.body.mabelEmail,
      bcc: "anthonygohyf@gmail.com",
      subject: "Precede TKA Survey Report",
      text:
        "Thank you for taking part in the Precede TKA Survey!\n\n" +
        "Please find your survey report attached.\n\n" +
        "Best regards,\nPrecede TKA Team",
      attachments: [
        {
          filename: "survey-report.pdf",
          content: pdfBuffer,
        },
      ],
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Email send failed:", error);
    return res.status(500).json({ message: "Failed to send email" });
  }
});



export { router };