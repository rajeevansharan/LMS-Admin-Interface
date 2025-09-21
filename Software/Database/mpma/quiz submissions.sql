-- This script adds submissions for YOUR existing students and YOUR existing quiz.

-- Submission 1: Student with person_id=1 submits the "Weekly Test" (activity_id=37)
INSERT INTO public.submission (activity_id, student_id, submission_date, status, file_path)
VALUES ('37', '1', NOW() - INTERVAL '1 day', 'SUBMITTED', NULL);

-- Submission 2: Student with person_id=2 submits the same "Weekly Test" (activity_id=37)
-- Let's say this one is already graded by the lecturer (person_id=3).
INSERT INTO public.submission (activity_id, student_id, submission_date, status, file_path, marks_obtained, feedback, graded_by, grading_date)
VALUES ('37', '2', NOW() - INTERVAL '2 days', 'GRADED', NULL, 85.0, 'Well done, a few areas to review.', 3, NOW());