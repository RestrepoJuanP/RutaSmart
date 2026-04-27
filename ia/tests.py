from django.test import SimpleTestCase, override_settings

from .services import _get_client


class OpenAIClientTests(SimpleTestCase):
    @override_settings(OPENAI_API_KEY="test-key")
    def test_get_client_uses_openai_api_key_from_settings(self):
        client = _get_client()

        self.assertIsNotNone(client)

    @override_settings(OPENAI_API_KEY="")
    def test_get_client_fails_when_api_key_is_missing(self):
        with self.assertRaisesMessage(
            RuntimeError,
            "No se encontro OPENAI_API_KEY en las variables de entorno.",
        ):
            _get_client()
