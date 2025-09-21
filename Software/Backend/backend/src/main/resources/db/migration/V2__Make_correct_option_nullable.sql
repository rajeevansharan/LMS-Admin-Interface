-- Make the correct_option_id column in single_choice_question table nullable
-- This allows us to create questions without immediately setting a correct answer
ALTER TABLE single_choice_question ALTER COLUMN correct_option_id DROP NOT NULL;
