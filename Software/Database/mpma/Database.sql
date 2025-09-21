-- Create custom types
CREATE TYPE user_role AS ENUM ('ADMINISTRATOR', 'LECTURER', 'STUDENT', 'TRAINER', 'TRAINEE'); -- Done
CREATE TYPE question_type AS ENUM ('SINGLE_CHOICE', 'MULTIPLE_CHOICE');
CREATE TYPE login_status AS ENUM ('SUCCESS', 'FAILED', 'LOGOUT'); -- Added for login attempt tracking

-- Core tables
CREATE TABLE person (
    person_id        SERIAL PRIMARY KEY,
    name             VARCHAR(255) NOT NULL,
    username         VARCHAR(50) UNIQUE NOT NULL,
    password         VARCHAR(255) NOT NULL,
    role             user_role NOT NULL,
    address          VARCHAR(255),
    date_of_birth    DATE,
    phone_number     VARCHAR(20),
    email            VARCHAR(255) UNIQUE,
    profile_picture  VARCHAR(255)
); -- Done

-- Login attempt tracking table
CREATE TABLE login_attempt (
    attempt_id   SERIAL PRIMARY KEY,
    username     VARCHAR(50) NOT NULL,
    ip_address   VARCHAR(45) NOT NULL,  -- Supports both IPv4 and IPv6
    status       login_status NOT NULL,
    attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_agent   VARCHAR(255),
    details      TEXT
);

CREATE TABLE administrator (
    person_id INTEGER PRIMARY KEY,
    FOREIGN KEY (person_id) REFERENCES person(person_id) ON DELETE CASCADE
);

CREATE TABLE lecturer (
    person_id         INTEGER PRIMARY KEY,
    department        VARCHAR(255),
    areas_of_interest TEXT,
    FOREIGN KEY (person_id) REFERENCES person(person_id) ON DELETE CASCADE
); -- Done

CREATE TABLE student (
    person_id INTEGER PRIMARY KEY,
    FOREIGN KEY (person_id) REFERENCES person(person_id) ON DELETE CASCADE
);

CREATE TABLE trainer (
    person_id INTEGER PRIMARY KEY,
    FOREIGN KEY (person_id) REFERENCES person(person_id) ON DELETE CASCADE
);

CREATE TABLE medical_document (
    document_id   SERIAL PRIMARY KEY,
    status        VARCHAR(50),
    medical_id    INTEGER,
    description   TEXT
);

CREATE TABLE trainee (
    person_id           INTEGER PRIMARY KEY,
    medical_document_id INTEGER,
    FOREIGN KEY (person_id) REFERENCES student(person_id) ON DELETE CASCADE,
    FOREIGN KEY (medical_document_id) REFERENCES medical_document(document_id) ON DELETE SET NULL
);

-- Course management
CREATE TABLE course (
    course_id   SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    start_date  DATE NOT NULL,
    end_date    DATE
--     duration    INTEGER NOT NULL  -- This is not needed.
);  -- Done

CREATE TABLE course_lecturer (
    course_id   INTEGER,
    lecturer_id INTEGER,
    PRIMARY KEY (course_id, lecturer_id),
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
    FOREIGN KEY (lecturer_id) REFERENCES lecturer(person_id) ON DELETE CASCADE
);  -- Done

CREATE TABLE enrollment (
    student_id  INTEGER,
    course_id   INTEGER,
    enroll_date DATE NOT NULL DEFAULT CURRENT_DATE,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES student(person_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE
);

-- Materials and content
CREATE TABLE material (
    material_id  SERIAL PRIMARY KEY,
    title        VARCHAR(255) NOT NULL,
    upload_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    visible      BOOLEAN DEFAULT true,
    description  TEXT,
    course_id    INTEGER,
    uploader_id  INTEGER,
    material_type VARCHAR(50) NOT NULL, -- 'DOCUMENT', 'ANNOUNCEMENT', etc.
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
    FOREIGN KEY (uploader_id) REFERENCES person(person_id) ON DELETE SET NULL
);  -- Done

CREATE TABLE course_material (
    material_id  INTEGER PRIMARY KEY,
    file_type    VARCHAR(50),
    file_path    VARCHAR(255),
    FOREIGN KEY (material_id) REFERENCES material(material_id) ON DELETE CASCADE
);  -- Done

CREATE TABLE announcement (
    material_id  INTEGER PRIMARY KEY,
    content      TEXT NOT NULL,
    FOREIGN KEY (material_id) REFERENCES material(material_id) ON DELETE CASCADE
);  -- Done

-- Lectures
CREATE TABLE lecture (
    lecture_id   SERIAL PRIMARY KEY,
    course_id    INTEGER NOT NULL,
    lecturer_id  INTEGER,
    title        VARCHAR(255) NOT NULL,
    start_time   TIMESTAMP NOT NULL,
    duration     INTEGER,
    location     VARCHAR(255),
    description  TEXT,
    material_id  INTEGER,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
    FOREIGN KEY (lecturer_id) REFERENCES lecturer(person_id) ON DELETE SET NULL,
    FOREIGN KEY (material_id) REFERENCES material(material_id) ON DELETE SET NULL
);  -- Done

CREATE TABLE attendance (
    lecture_id        INTEGER,
    student_id        INTEGER,
    status            VARCHAR(50) DEFAULT 'ABSENT',
    timestamp         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (lecture_id, student_id),
    FOREIGN KEY (lecture_id) REFERENCES lecture(lecture_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student(person_id) ON DELETE CASCADE
);

-- Activities (Assignment, Quiz)
CREATE TABLE activity (
    activity_id       SERIAL PRIMARY KEY,
    course_id         INTEGER NOT NULL,
    title             VARCHAR(255) NOT NULL,
    description       TEXT,
    creation_date     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date          TIMESTAMP,
    max_score         INTEGER,
    weight            DECIMAL(5,2),
    visible           BOOLEAN DEFAULT true,
    activity_type     VARCHAR(50) NOT NULL, -- 'ASSIGNMENT', 'QUIZ', etc.

    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE
);  -- Done

CREATE TABLE assignment (
    activity_id       INTEGER PRIMARY KEY,
    instructions      TEXT,
    allowed_file_types VARCHAR(255),
    FOREIGN KEY (activity_id) REFERENCES activity(activity_id) ON DELETE CASCADE
);  -- Done

CREATE TABLE quiz (
    activity_id       INTEGER PRIMARY KEY,
    time_limit        INTEGER,
    attempt_limit     INTEGER DEFAULT 1,
    shuffle_questions BOOLEAN DEFAULT false,
    FOREIGN KEY (activity_id) REFERENCES activity(activity_id) ON DELETE CASCADE
);  -- Done

CREATE TABLE question (
    question_id   SERIAL PRIMARY KEY,
    quiz_id       INTEGER NOT NULL,
    text          TEXT NOT NULL,
    question_type question_type NOT NULL DEFAULT 'SINGLE_CHOICE',
    points        INTEGER DEFAULT 1,
    position      INTEGER,
    FOREIGN KEY (quiz_id) REFERENCES quiz(activity_id) ON DELETE CASCADE
); -- Done

CREATE TABLE option (
    option_id     SERIAL PRIMARY KEY,
    question_id   INTEGER NOT NULL,
    text          TEXT NOT NULL,
    is_correct    BOOLEAN NOT NULL DEFAULT false,
    position      INTEGER,
    FOREIGN KEY (question_id) REFERENCES question(question_id) ON DELETE CASCADE
);
CREATE TABLE quiz_attempt (
                              attempt_id       SERIAL PRIMARY KEY,
                              submission_id    INTEGER NOT NULL,
                              start_time       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              end_time         TIMESTAMP,
                              score            DECIMAL(5,2),
                              attempt_number   INTEGER NOT NULL,
                              FOREIGN KEY (submission_id) REFERENCES submission(submission_id) ON DELETE CASCADE,
                              UNIQUE(submission_id, attempt_number)
);

CREATE TABLE answer (
                          answer_id        SERIAL PRIMARY KEY,
                          attempt_id       INTEGER NOT NULL,
                          question_id      INTEGER NOT NULL,
                          selected_options INTEGER[],
                          text_answer      TEXT,
                          score            DECIMAL(5,2),
                          FOREIGN KEY (attempt_id) REFERENCES quiz_attempt(attempt_id) ON DELETE CASCADE,
                          FOREIGN KEY (question_id) REFERENCES question(question_id) ON DELETE CASCADE
  );
-- Submissions and Attempts
CREATE TABLE submission (
    submission_id      SERIAL PRIMARY KEY,
    activity_id        INTEGER NOT NULL,
    student_id         INTEGER NOT NULL,
    submission_date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_path          VARCHAR(255),
    score              DECIMAL(5,2),
    feedback           TEXT,
    status             VARCHAR(50) DEFAULT 'SUBMITTED',
    graded_by          INTEGER,
    graded_date        TIMESTAMP,
--     medical_document_id INTEGER,  --- Not Relevant Here
    FOREIGN KEY (activity_id) REFERENCES activity(activity_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student(person_id) ON DELETE CASCADE,
    FOREIGN KEY (graded_by) REFERENCES person(person_id) ON DELETE SET NULL,
--     FOREIGN KEY (medical_document_id) REFERENCES medical_document(document_id) ON DELETE SET NULL
);  -- Done



-- Academic records
CREATE TABLE semester (
    semester_id   SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    start_date    DATE NOT NULL,
    end_date      DATE NOT NULL
);

CREATE TABLE transcript (
    transcript_id SERIAL PRIMARY KEY,
    student_id    INTEGER NOT NULL,
    semester_id   INTEGER NOT NULL,
    gpa           DECIMAL(3,2),
    issued_date   DATE DEFAULT CURRENT_DATE,
    notes         TEXT,
    FOREIGN KEY (student_id) REFERENCES student(person_id) ON DELETE CASCADE,
    FOREIGN KEY (semester_id) REFERENCES semester(semester_id) ON DELETE CASCADE,
    UNIQUE(student_id, semester_id)
);

CREATE TABLE certificate (
    certificate_id    SERIAL PRIMARY KEY,
    student_id        INTEGER NOT NULL,
    course_id         INTEGER NOT NULL,
    issue_date        DATE DEFAULT CURRENT_DATE,
    template_id       INTEGER,
    approved_by       INTEGER,
    FOREIGN KEY (student_id) REFERENCES student(person_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES administrator(person_id) ON DELETE SET NULL
);

-- Other supporting features
CREATE TABLE notification (
    notification_id   SERIAL PRIMARY KEY,
    title             VARCHAR(255) NOT NULL,
    content           TEXT NOT NULL,
    created_date      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by        INTEGER,
    target_role       user_role,
    course_id         INTEGER,
    FOREIGN KEY (created_by) REFERENCES person(person_id) ON DELETE SET NULL,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE
);

CREATE TABLE notification_recipient (
    notification_id   INTEGER,
    person_id         INTEGER,
    read_date         TIMESTAMP,
    PRIMARY KEY (notification_id, person_id),
    FOREIGN KEY (notification_id) REFERENCES notification(notification_id) ON DELETE CASCADE,
    FOREIGN KEY (person_id) REFERENCES person(person_id) ON DELETE CASCADE
);

CREATE TABLE document (
    document_id   SERIAL PRIMARY KEY,
    title         VARCHAR(255) NOT NULL,
    file_path     VARCHAR(255) NOT NULL,
    upload_date   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploader_id   INTEGER,
    description   TEXT,
    tags          VARCHAR[],
    FOREIGN KEY (uploader_id) REFERENCES person(person_id) ON DELETE SET NULL
);

CREATE TABLE calendar_event (
    event_id      SERIAL PRIMARY KEY,
    title         VARCHAR(255) NOT NULL,
    description   TEXT,
    start_time    TIMESTAMP NOT NULL,
    end_time      TIMESTAMP,
    location      VARCHAR(255),
    created_by    INTEGER,
    course_id     INTEGER,
    FOREIGN KEY (created_by) REFERENCES person(person_id) ON DELETE SET NULL,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE
);

-- Training specific tables
CREATE TABLE training_log (
    log_id        SERIAL PRIMARY KEY,
    trainee_id    INTEGER NOT NULL,
    trainer_id    INTEGER,
    log_date      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content       TEXT NOT NULL,
    FOREIGN KEY (trainee_id) REFERENCES trainee(person_id) ON DELETE CASCADE,
    FOREIGN KEY (trainer_id) REFERENCES trainer(person_id) ON DELETE SET NULL
);

CREATE TABLE report (
    report_id     SERIAL PRIMARY KEY,
    trainee_id    INTEGER NOT NULL,
    trainer_id    INTEGER NOT NULL,
    report_date   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content       TEXT NOT NULL,
    FOREIGN KEY (trainee_id) REFERENCES trainee(person_id) ON DELETE CASCADE,
    FOREIGN KEY (trainer_id) REFERENCES trainer(person_id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_person_role ON person(role);
CREATE INDEX idx_course_name ON course(name);
CREATE INDEX idx_material_course ON material(course_id);
CREATE INDEX idx_activity_course ON activity(course_id);
CREATE INDEX idx_submission_activity_student ON submission(activity_id, student_id);
CREATE INDEX idx_notification_course ON notification(course_id);
CREATE INDEX idx_calendar_course ON calendar_event(course_id);
