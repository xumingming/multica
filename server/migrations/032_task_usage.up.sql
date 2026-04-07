ALTER TABLE agent_task_queue ADD COLUMN input_tokens BIGINT;
ALTER TABLE agent_task_queue ADD COLUMN output_tokens BIGINT;
ALTER TABLE agent_task_queue ADD COLUMN cache_read_tokens BIGINT;
ALTER TABLE agent_task_queue ADD COLUMN cache_write_tokens BIGINT;
ALTER TABLE agent_task_queue ADD COLUMN model TEXT;
