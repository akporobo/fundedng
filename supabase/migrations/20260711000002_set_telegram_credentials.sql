-- Set Telegram bot credentials in app_config
INSERT INTO public.app_config (key, value) VALUES
  ('telegram_bot_token', '8700456865:AAGqenii8t2jcATiGLUwC_J5nJk25D4Tjkw'),
  ('telegram_chat_id', '-1003991560803')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
