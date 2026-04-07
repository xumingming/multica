ALTER TABLE agent_task_queue DROP COLUMN IF EXISTS input_tokens;
ALTER TABLE agent_task_queue DROP COLUMN IF EXISTS output_tokens;
ALTER TABLE agent_task_queue DROP COLUMN IF EXISTS cache_read_tokens;
ALTER TABLE agent_task_queue DROP COLUMN IF EXISTS cache_write_tokens;
ALTER TABLE agent_task_queue DROP COLUMN IF EXISTS model;
