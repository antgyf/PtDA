-- ============================================
-- Database Reset Script for Testing
-- Run this in pgAdmin to completely reset the database
-- ============================================

-- ==============================
-- 1. CLEANUP - Drop all tables in correct order
-- ==============================

DO $$ 
BEGIN
    RAISE NOTICE 'Starting database reset...';
    
    -- Drop tables in reverse dependency order
    DROP TABLE IF EXISTS patientpriority CASCADE;
    DROP TABLE IF EXISTS patientformresponse CASCADE;
    DROP TABLE IF EXISTS patientform CASCADE;
    DROP TABLE IF EXISTS refformresponse CASCADE;
    DROP TABLE IF EXISTS refform CASCADE;
    DROP TABLE IF EXISTS referencepatient CASCADE;
    DROP TABLE IF EXISTS patient CASCADE;
    DROP TABLE IF EXISTS stagingraw CASCADE;
    DROP TABLE IF EXISTS question CASCADE;
    DROP TABLE IF EXISTS researcher CASCADE;
    DROP TABLE IF EXISTS surgeon CASCADE;
    
    RAISE NOTICE 'All tables dropped successfully';
END $$;

-- ==============================
-- 2. RECREATE TABLES
-- ==============================

-- Surgeon table
CREATE TABLE surgeon (
    surgeonid SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- Researcher table
CREATE TABLE researcher (
    researcherid SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- Patient table
CREATE TABLE patient (
    patientid SERIAL PRIMARY KEY,
    fullname TEXT NOT NULL,
    sex INT NOT NULL,
    ethnicity INT NOT NULL,
    age INT NOT NULL,
    height NUMERIC(5, 2) NOT NULL,
    weight NUMERIC(5, 2) NOT NULL,
    bmi NUMERIC(5, 2) NOT NULL,
    bmicategory INT NOT NULL,
    agegroup INT NOT NULL,
    hasform BOOLEAN NOT NULL DEFAULT FALSE
);

-- Reference Patient table (patients from dataset)
CREATE TABLE referencepatient (
    referencepatientid SERIAL PRIMARY KEY,
    participantid TEXT UNIQUE NOT NULL,
    sex INT NOT NULL,
    ethnicity INT NOT NULL,
    age INT NOT NULL,
    bmicategory INT NOT NULL,
    agegroup INT NOT NULL,
    bmi NUMERIC(5, 2) NOT NULL
);

-- Question table
CREATE TABLE question (
    questionid SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    text TEXT NOT NULL
);

-- Form tables
CREATE TABLE refform (
    formid SERIAL PRIMARY KEY,
    referencepatientid INT NOT NULL REFERENCES referencepatient(referencepatientid) ON DELETE CASCADE,
    term INT NOT NULL,
    UNIQUE (referencepatientid, term)
);

CREATE TABLE refformresponse (
    responseid SERIAL PRIMARY KEY,
    formid INT NOT NULL REFERENCES refform(formid) ON DELETE CASCADE,
    questionid INT NOT NULL REFERENCES question(questionid) ON DELETE CASCADE,
    answervalue INT NOT NULL,
    UNIQUE (formid, questionid)
);

CREATE TABLE patientform (
    formid SERIAL PRIMARY KEY,
    patientid INT NOT NULL REFERENCES patient(patientid) ON DELETE CASCADE,
    term INT NOT NULL,
    UNIQUE (patientid, term)
);

CREATE TABLE patientformresponse (
    responseid SERIAL PRIMARY KEY,
    formid INT NOT NULL REFERENCES patientform(formid) ON DELETE CASCADE,
    questionid INT NOT NULL REFERENCES question(questionid) ON DELETE CASCADE,
    answervalue INT,
    UNIQUE (formid, questionid)
);

CREATE TABLE patientpriority (
    priorityid SERIAL PRIMARY KEY,
    patientid INT NOT NULL REFERENCES patient(patientid) ON DELETE CASCADE,
    questionid INT NOT NULL REFERENCES question(questionid) ON DELETE CASCADE,
    term INT NOT NULL,
    UNIQUE (patientid, questionid, term)
);

-- Staging Raw Table
CREATE TABLE stagingraw (
    participant_id TEXT,
    "Age" INT,
    "Gender" INT,

    "(Post-BS)EQ Mobility" INT,
    "(Post-BS)EQ Self-care" INT,
    "(Post-BS)EQ Usual activities" INT,
    "(Post-BS)EQ Pain/Discomfort" INT,
    "(Post-BS)EQ Anxiety/Depression" INT,

    "(Post-BS)BO Breathing" INT,
    "(Post-BS)BO Sleep" INT,
    "(Post-BS)BO Tiredness" INT,
    "(Post-BS)BO Appearance" INT,
    "(Post-BS)BO Romantic/Intimate" INT,
    "(Post-BS)BO Discriminate/Humil" INT,
    "(Post-BS)BO Social activities" INT,
    "(Post-BS)BO Confidence" INT,
    "(Post-BS)BO Burden to others" INT,
    "(Post-BS)BO Diet control" INT,
    "(Post-BS)BO Food enjoyment" INT,
    "(Post-BS)BO GI problems" INT,

    "ethnic3" INT,
    "Pre-operative BMI(Clinical records)" NUMERIC(5, 2),
    "BMI category(for PSM)" INT,
    "Age group (21-50 or 51+)" INT,

    "(Pre-BS)EQ Mobility" INT,
    "(Pre-BS)EQ Self-care" INT,
    "(Pre-BS)EQ Usual activities" INT,
    "(Pre-BS)EQ Pain/Discomfort" INT,
    "(Pre-BS)EQ Anxiety/Depression" INT,

    "(Pre-BS)BO Breathing" INT,
    "(Pre-BS)BO Sleep" INT,
    "(Pre-BS)BO Tiredness" INT,
    "(Pre-BS)BO Appearance" INT,
    "(Pre-BS)BO Romantic/Intimate" INT,
    "(Pre-BS)BO Discriminate/Humil" INT,
    "(Pre-BS)BO Social activities" INT,
    "(Pre-BS)BO Confidence" INT,
    "(Pre-BS)BO Burden to others" INT,
    "(Pre-BS)BO Diet control" INT,
    "(Pre-BS)BO Food enjoyment" INT,
    "(Pre-BS)BO GI problems" INT
);

DO $$ 
BEGIN
    RAISE NOTICE 'All tables recreated successfully';
END $$;

-- ==============================
-- 3. SEED STATIC DATA
-- ==============================

-- Seed Questions (without EQ5D as requested)
INSERT INTO question (code, text) VALUES
('EQ5D-MOB', 'Did you have problems in walking about today?'),
('EQ5D-SC', 'Did you have problems in washing or dressing yourself today?'),
('EQ5D-UA', 'Did you have problems in doing your usual activities today? (e.g. work, study, housework, family or leisure activities)'),
('EQ5D-PD', 'Did you have any pain/discomfort today?'),
('EQ5D-AD', 'Did you feel anxious/depressed today?'),

('BO-BREATHING', 'Did you have breathing problems today? (e.g. shortness of breath, wheezing, coughing, or phlegm)'),
('BO-SLEEP', 'Did you have problems with sleep today?'),
('BO-TIREDNESS', 'Did you feel tired today?'),
('BO-APPEARANCE', 'Did you have problems accepting your appearance today? (e.g. overall appearance, body shape, skin, etc.)'),
('BO-ROMANTIC-INTIMATE', 'Did you have problems starting or maintaining intimate relationships today? (including sexual relationships)'),
('BO-DISCRIMINATE-HUMIL', 'Did you experience discrimination or humiliation today?'),
('BO-SOCIAL-ACTIVITIES', 'Did you have problems participating in social activities today? (e.g. meeting others, eating together, or doing activities together)'),
('BO-CONFIDENCE', 'Did you feel unconfident today?'),
('BO-BURDEN-OTHERS', 'Did you feel like you were a burden to others today?'),
('BO-DIET-CONTROL', 'Did you have problems controlling your diet today? (e.g. controlling food portions and food choices)'),
('BO-FOOD-ENJOYMENT', 'Did you have problems enjoying food today?'),
('BO-GI-PROBLEMS', 'Did you have gastrointestinal problems today? (e.g. nausea, vomiting, heartburn, bloating, diarrhoea, or constipation)');

DO $$ 
BEGIN
    RAISE NOTICE 'Static data seeded successfully';
    RAISE NOTICE 'Questions inserted: %', (SELECT COUNT(*) FROM question);
END $$;

-- ==============================
-- 4. LOAD STAGING DATA (You'll need to modify this part)
-- ==============================

DO $$ 
BEGIN
    -- Clear any existing data first
    TRUNCATE TABLE stagingraw;
    
    -- Load from CSV - use single quotes only and forward slashes
    COPY stagingraw FROM 'C:/Program Files/PostgreSQL/17/data/Simulated dataset for PtDA_simulated_2026-02-12 (NoLabel) (1).csv' DELIMITER ',' CSV HEADER;
    
    RAISE NOTICE 'Staging data loaded successfully';
    RAISE NOTICE 'Records in stagingraw: %', (SELECT COUNT(*) FROM stagingraw);
    
EXCEPTION 
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not load staging data automatically: %', SQLERRM;
        RAISE NOTICE 'Please load staging data manually using pgAdmin import tool';
        RAISE NOTICE 'Expected file format: CSV with headers matching stagingraw columns';
END $$;

-- ==============================
-- 5. POPULATE REFERENCE PATIENTS AND FORMS
-- ==============================
INSERT INTO referencepatient (
    participantid,
    sex,
    ethnicity,
    age,
    bmicategory,
    agegroup,
    bmi
)
SELECT
    sr."participant_id"::TEXT AS participantid,
    sr."Gender" AS sex,
    sr."ethnic3" AS ethnicity,
    sr."Age" AS age,

    sr."BMI category(for PSM)" AS bmicategory,
    sr."Age group (21-50 or 51+)" AS agegroup,
    sr."Pre-operative BMI(Clinical records)"::NUMERIC(5,2) AS bmi

FROM stagingraw sr
ON CONFLICT (participantid) DO UPDATE
SET
    sex = EXCLUDED.sex,
    ethnicity = EXCLUDED.ethnicity,
    age = EXCLUDED.age,
    bmicategory = EXCLUDED.bmicategory,
    agegroup = EXCLUDED.agegroup,
    bmi = EXCLUDED.bmi;
    
    
-- Insert into form and formresponse from stagingraw
-- This involves unpivoting the wide format of responses into a long format
-- Step 1: Flatten all patient responses across timepoints
DO $$
DECLARE
    form_count INT;
    response_count INT;
BEGIN

    WITH flattened AS (
        SELECT
            rp.referencepatientid,
            v.term,
            v.code,
            CASE
                WHEN v.raw_answervalue IS NULL THEN NULL
                ELSE v.raw_answervalue - 1
            END AS answervalue
        FROM stagingraw sr
        JOIN referencepatient rp
            ON rp.participantid = sr."participant_id"::TEXT

        CROSS JOIN LATERAL (
            VALUES
                -- ======================
                -- PRE-BS ANSWERS
                -- term = 0
                -- ======================
                (0, 'EQ5D-MOB',                sr."(Pre-BS)EQ Mobility"),
                (0, 'EQ5D-SC',                 sr."(Pre-BS)EQ Self-care"),
                (0, 'EQ5D-UA',                 sr."(Pre-BS)EQ Usual activities"),
                (0, 'EQ5D-PD',                 sr."(Pre-BS)EQ Pain/Discomfort"),
                (0, 'EQ5D-AD',                 sr."(Pre-BS)EQ Anxiety/Depression"),

                (0, 'BO-BREATHING',            sr."(Pre-BS)BO Breathing"),
                (0, 'BO-SLEEP',                sr."(Pre-BS)BO Sleep"),
                (0, 'BO-TIREDNESS',            sr."(Pre-BS)BO Tiredness"),
                (0, 'BO-APPEARANCE',           sr."(Pre-BS)BO Appearance"),
                (0, 'BO-ROMANTIC-INTIMATE',    sr."(Pre-BS)BO Romantic/Intimate"),
                (0, 'BO-DISCRIMINATE-HUMIL',   sr."(Pre-BS)BO Discriminate/Humil"),
                (0, 'BO-SOCIAL-ACTIVITIES',    sr."(Pre-BS)BO Social activities"),
                (0, 'BO-CONFIDENCE',           sr."(Pre-BS)BO Confidence"),
                (0, 'BO-BURDEN-OTHERS',        sr."(Pre-BS)BO Burden to others"),
                (0, 'BO-DIET-CONTROL',         sr."(Pre-BS)BO Diet control"),
                (0, 'BO-FOOD-ENJOYMENT',       sr."(Pre-BS)BO Food enjoyment"),
                (0, 'BO-GI-PROBLEMS',          sr."(Pre-BS)BO GI problems"),

                -- ======================
                -- POST-BS ANSWERS
                -- term = 1
                -- ======================
                (1, 'EQ5D-MOB',                sr."(Post-BS)EQ Mobility"),
                (1, 'EQ5D-SC',                 sr."(Post-BS)EQ Self-care"),
                (1, 'EQ5D-UA',                 sr."(Post-BS)EQ Usual activities"),
                (1, 'EQ5D-PD',                 sr."(Post-BS)EQ Pain/Discomfort"),
                (1, 'EQ5D-AD',                 sr."(Post-BS)EQ Anxiety/Depression"),

                (1, 'BO-BREATHING',            sr."(Post-BS)BO Breathing"),
                (1, 'BO-SLEEP',                sr."(Post-BS)BO Sleep"),
                (1, 'BO-TIREDNESS',            sr."(Post-BS)BO Tiredness"),
                (1, 'BO-APPEARANCE',           sr."(Post-BS)BO Appearance"),
                (1, 'BO-ROMANTIC-INTIMATE',    sr."(Post-BS)BO Romantic/Intimate"),
                (1, 'BO-DISCRIMINATE-HUMIL',   sr."(Post-BS)BO Discriminate/Humil"),
                (1, 'BO-SOCIAL-ACTIVITIES',    sr."(Post-BS)BO Social activities"),
                (1, 'BO-CONFIDENCE',           sr."(Post-BS)BO Confidence"),
                (1, 'BO-BURDEN-OTHERS',        sr."(Post-BS)BO Burden to others"),
                (1, 'BO-DIET-CONTROL',         sr."(Post-BS)BO Diet control"),
                (1, 'BO-FOOD-ENJOYMENT',       sr."(Post-BS)BO Food enjoyment"),
                (1, 'BO-GI-PROBLEMS',          sr."(Post-BS)BO GI problems")
        ) AS v(term, code, raw_answervalue)
    ),

    insertedforms AS (
        INSERT INTO refform (
            referencepatientid,
            term
        )
        SELECT DISTINCT
            fl.referencepatientid,
            fl.term
        FROM flattened fl
        WHERE NOT EXISTS (
            SELECT 1
            FROM refform rf
            WHERE rf.referencepatientid = fl.referencepatientid
              AND rf.term = fl.term
        )
        RETURNING formid, referencepatientid, term
    ),

    allforms AS (
        SELECT formid, referencepatientid, term
        FROM insertedforms

        UNION

        SELECT rf.formid, rf.referencepatientid, rf.term
        FROM refform rf
        JOIN (
            SELECT DISTINCT referencepatientid, term
            FROM flattened
        ) fl
            ON fl.referencepatientid = rf.referencepatientid
           AND fl.term = rf.term
    )

    INSERT INTO refformresponse (
        formid,
        questionid,
        answervalue
    )
    SELECT
        af.formid,
        q.questionid,
        fl.answervalue
    FROM flattened fl
    JOIN allforms af
        ON af.referencepatientid = fl.referencepatientid
       AND af.term = fl.term
    JOIN question q
        ON q.code = fl.code
    WHERE fl.answervalue IS NOT NULL
      AND NOT EXISTS (
          SELECT 1
          FROM refformresponse rfr
          WHERE rfr.formid = af.formid
            AND rfr.questionid = q.questionid
      );

    GET DIAGNOSTICS response_count = ROW_COUNT;

    SELECT COUNT(*) INTO form_count
    FROM refform;

    RAISE NOTICE 'Forms and responses populated.';
    RAISE NOTICE 'Total forms: %', form_count;
    RAISE NOTICE 'New responses inserted: %', response_count;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error during form/response population: %', SQLERRM;
        RAISE;
END $$;

SELECT COUNT(*) FROM stagingraw;
SELECT COUNT(*) FROM referencepatient;
SELECT COUNT(*) FROM refform;
SELECT COUNT(*) FROM refformresponse;