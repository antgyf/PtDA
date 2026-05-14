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
    agegroup
  } = req.body;

  try {
    // Ensure ID is provided
    if (!patientid) {
      return res.status(400).json({ message: "Patient ID is required." });
    }

    // Update patient data in the database
    const result = await pool.query(
      `UPDATE patient
       SET fullname = $1, sex = $2, ethnicity = $3, 
           age = $4, bmi = $5, height = $6, weight = $7, bmicategory = $8, agegroup = $9
       WHERE patientid = $10
       RETURNING patientid, fullname, sex, ethnicity, age, bmi, height, weight, bmicategory, agegroup;`,
      [fullname, sex, ethnicity, age, bmi, height, weight, bmicategory, agegroup, patientid]
    );

    // If no rows were updated, return an error
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Patient not found." });
    }

    res.status(200).json({
      message: "Patient updated successfully",
      patient: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

// Define expected request body interface
interface AddPatientRequest {
  fullname: string;
  sex: number;
  ethnicity: number;
  age: number;
  bmi: number;
  height: number;
  weight: number;
}

router.get("/searchByName", async (req: Request, res: Response) => {
  const { name, page = 1, limit = 10 } = req.query;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Valid name parameter is required" });
  }

  try {
    const offset = (Number(page) - 1) * Number(limit);

    const result = await pool.query(
      `SELECT * 
       FROM patient 
       WHERE fullname ILIKE $1
       ORDER BY patientid DESC
       LIMIT $2 OFFSET $3`,
      [`%${name}%`, Number(limit), offset]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No patients found with the given name",
        totalPatients: 0,
      });
    }

    // Count total for pagination
    const countResult = await pool.query(
      `SELECT COUNT(*) 
       FROM patient 
       WHERE fullname ILIKE $1`,
      [`%${name}%`]
    );

    const totalPatients = Number(countResult.rows[0].count);

    res.status(200).json({
      patients: result.rows,
      totalPatients,
      totalPages: Math.ceil(totalPatients / Number(limit)),
      currentPage: Number(page),
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
    bmi
  } = req.query;

  try {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const offset = (pageNumber - 1) * limitNumber;

    const values: (string | number)[] = [];
    let conditionIndex = 1;

    // Base queries
    let query = `SELECT p.* FROM patient p`;
    let countQuery = `SELECT COUNT(*) FROM patient p`;

    query += ` WHERE 1=1`;
    countQuery += ` WHERE 1=1`;

    // sex filter
    if (sex) {
      query += ` AND p.sex = $${conditionIndex}`;
      countQuery += ` AND p.sex = $${conditionIndex}`;
      values.push(Number(sex));
      conditionIndex++;
    }

    // ethnicity filter
    if (ethnicity) {
      query += ` AND p.ethnicity = $${conditionIndex}`;
      countQuery += ` AND p.ethnicity = $${conditionIndex}`;
      values.push(Number(ethnicity));
      conditionIndex++;
    }

    // age filter
    if (age) {
      query += ` AND p.age = $${conditionIndex}`;
      countQuery += ` AND p.age = $${conditionIndex}`;
      values.push(Number(age));
      conditionIndex++;
    }

    // bmi filter
    if (bmi) {
      if (bmi === "0") {
        query += ` AND p.bmi < $${conditionIndex}`;
        countQuery += ` AND p.bmi < $${conditionIndex}`;
        values.push(25);
      } else if (bmi === "1") {
        query += ` AND p.bmi >= $${conditionIndex}`;
        countQuery += ` AND p.bmi >= $${conditionIndex}`;
        values.push(25);
      }
      conditionIndex++;
    }

    // Add pagination
    query += ` ORDER BY p.patientid DESC LIMIT $${conditionIndex} OFFSET $${conditionIndex + 1}`;
    values.push(limitNumber, offset);

    // Run main query
    const result = await pool.query(query, values);

    // Run count query (exclude LIMIT/OFFSET values)
    const countResult = await pool.query(
      countQuery,
      values.slice(0, conditionIndex - 1)
    );
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
  surgeonid: number;
  surgeontitle: string;
  age: number;
  sex: number;
  ethnicity: number;
  height: number;
  weight: number;
  bmi: number;
}

const formatConditions = (
  filters: {
    categories: string[];
    age?: { range: number };
    bmi?: { range: number };
    surgeonid?: string;
    surgeontitle?: string;
  },
  patient: Patient,
  questionid: number = 0,
  number = 0
) => {
  const conditions: string[] = [];
  const params: (string | number)[] = [questionid];
  let surgeont = "";


  // Handle categorical filters (Ethnicity, Gender)
  if (filters.categories.includes("Ethnicity")) {
    conditions.push(`p.ethnicity = $${params.length + number + 1}`);
    params.push(patient.ethnicity);
  }
  if (filters.categories.includes("Gender")) {
    conditions.push(`p.sex = $${params.length + number + 1}`);
    params.push(patient.sex);
  }

  if (filters.categories.includes("Surgeon ID") && filters.surgeonid) {
    conditions.push(`p.surgeonid = $${params.length + number + 1}`);
    params.push(Number(filters.surgeonid));
  }

  // Handle Age Range Filter
  // Age filter
  if (filters.categories.includes("Age Range") && filters.age?.range !== undefined && patient.age) {
    conditions.push(`p.age BETWEEN $${params.length + number + 1} AND $${params.length + number + 2}`);
    params.push(Number(patient.age) - Number(filters.age.range));
    params.push(Number(patient.age) + Number(filters.age.range));
  }

  // BMI filter
  if (filters.categories.includes("BMI Range") && filters.bmi?.range !== undefined && patient.bmi) {
    conditions.push(`p.bmi BETWEEN $${params.length + number + 1} AND $${params.length + number + 2}`);
    params.push(Math.floor(Number(patient.bmi) - Number(filters.bmi.range)));
    params.push(Math.ceil(Number(patient.bmi) + Number(filters.bmi.range)));
  }

  if (filters.categories.includes("Surgeon Title") && filters.surgeontitle) {
    // Map display title to one or more possible DB values
    const surgeonTitleMap: Record<string, string[]> = {
      "Associate Consultant": ["AC"],
      "Consultant": ["C"],
      "Senior Consultant": ["AP", "P"] // 2 possible values
    };

    const mappedTitles = surgeonTitleMap[filters.surgeontitle] || [];

    if (mappedTitles.length === 1) {
      // Single title → use "="
      conditions.push(`p.surgeontitle = $${params.length + number + 1}`);
      params.push(mappedTitles[0]);
    } else if (mappedTitles.length > 1) {
      // Multiple titles → use "IN"
      const placeholders = mappedTitles
        .map((_, idx) => `$${params.length + number + idx + 1}`)
        .join(", ");
      conditions.push(`p.surgeontitle IN (${placeholders})`);
      params.push(...mappedTitles);
    }

    //console.log("Surgeon Title filter applied with values:", mappedTitles);
  }

  // Return formatted conditions and parameters
  return {
    conditionString: conditions.length > 0 ? conditions.join(" AND ") : "1=1",
    params,
  };
};


router.post("/before", async (req: Request, res: Response) => {
  const { questionid, options, patient, filters } = req.body;

  //console.log ("Received /before request with:", { questionid, options, patient, filters });
  
  try {
    const results: { option: string; count: number; percentage: number }[] = [];

    let conditions = "1=1"; // Default condition to prevent WHERE clause issues
    const queryParams: (string | number)[] = [];

    if (filters && Object.keys(filters).length > 0) {
      const filterConditions = formatConditions(filters, patient, questionid);
      conditions += ` AND ${filterConditions.conditionString}`;
      queryParams.push(...filterConditions.params);
    }

    //console.log("Conditions:", conditions);
    //console.log("Params:", queryParams);

    // Query to get the total number of rows with filters
    // only count from forms submitted 6 months after surgery
    const totalQuery = `
      SELECT COUNT(rfr.answervalue) AS total
      FROM refformresponse rfr
      JOIN refform f ON rfr.formid = f.formid
      JOIN referencepatient p ON f.referencepatientid = p.referencepatientid
      WHERE rfr.questionid = $1
        AND f.term = 0
        AND ${conditions}
    `;

    const { rows: totalResult } = await pool.query<{ total: number }>(
      totalQuery,
      queryParams
    );

    const totalRows = totalResult[0]?.total || 0;

    if (totalRows === 0) {
      console.log("No data found for the given filters.");
      res.status(200).json({
        message: "No data found for the given filters.",
        totalRows,
        data: [],
      });
      return;
    }

    // for now, ensure term = 1 (6 months after surgery)
    for (const option of options) {
      const query = `
        SELECT COUNT(rfr.answervalue) AS count
        FROM refformresponse rfr
        JOIN refform f ON rfr.formid = f.formid
        JOIN referencepatient p ON f.referencepatientid = p.referencepatientid
        WHERE rfr.questionid = $1
          AND f.term = 0
          AND rfr.answervalue = $${queryParams.length + 1}
          AND ${conditions}
      `;

      const { rows: optionRows } = await pool.query<{ count: number }>(query, [
        ...queryParams,
        option,
      ]);

      const count = Number(optionRows[0]?.count ?? 0);
      const percentage = Math.round((count / totalRows) * 100);

      results.push({ option, count, percentage });
    }

    //console.log("Results:", results);

    res.status(200).json({
      message: "Data fetched successfully",
      totalRows,
      data: results,
    });
  } catch (error) {
    console.error("Error fetching data from registry:", error);
    res.status(500).json({
      message: "Error fetching data from registry",
      error: error,
    });
  }
});

router.post("/after", async (req: Request, res: Response) => {
  const {
    questionid,   // this maps to question.code
    options,        // possible answer values
    filters,        // filtering params
    patient,
    initial,        // initial answer value
    term = 1,       // follow-up term (1, 2, 3...)
    median = false,
  } = req.body;

  //console.log("Received /after request with:", questionid);
  try {
    if (!questionid || !options) {
      res.status(400).json({ message: "Missing required parameters." });
      return;
    }

    const results: {
      option: string;
      count: number;
      percentage: number;
    }[] = [];

    // Step 1: Build conditions string + params
    let conditions = `1=1`;
    const queryParams: (string | number)[] = [];

    if (filters && Object.keys(filters).length > 0) {
      const filterConditions = formatConditions(filters, patient, questionid, 1);
      conditions += ` AND ${filterConditions.conditionString}`;
      queryParams.push(...filterConditions.params);
    }

    // Step 2: Find all patients who had the initial value at baseline (term=0)
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

    const { rows: baselineRows } = await pool.query<{ referencepatientid: number }>(
      baselineQuery,
      [initial, ...queryParams]
    );

    //console.log("baseline query:", baselineQuery);
    //console.log("query params:", [initial, ...queryParams]);

    const baselinePatientIds = baselineRows.map(r => r.referencepatientid);

    if (baselinePatientIds.length === 0) {
      res.status(200).json({
        message: "No baseline patients found for the given filters.",
        totalRows: 0,
        data: [],
      });
      return;
    }

    // Step 3: For each option, count how many of those patients had that response at the given term
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
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
      const { rows: optionRows } = await pool.query<{ count: number }>(
        optionQuery,
        [questionid, term, option, baselinePatientIds]
      );


      const count = optionRows[0]?.count || 0;

      results.push({
        option: option.toString(),
        count,
        percentage : 0, // Placeholder, will calculate next
      });
    }

    let totalCount = results.reduce((sum, r) => sum + Number(r.count), 0);

    // Calculate percentages
    for (let r of results) {
      r.percentage =
        totalCount > 0 ? Math.round((Number(r.count) / totalCount) * 100) : 0;
    }

    // Step 4: Optionally compute median
    let responsePayload: any = {
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

      for (let i = 0; i < sorted.length; i++) {
        cumulative += Number(sorted[i].count);
        if (cumulative >= midPoint) {
          medianValue = Number(sorted[i].option);
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
      error: error,
    });
    return;
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