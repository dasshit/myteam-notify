# Myteam-notify (Github Actions) (VK Teams)

<img src="https://icq.com/botapi/res/logo_icq_new.png" width="40%"><img src="https://myteam.mail.ru/botapi/res/logo_myteam.png" width="40%">

Простой способ отправить уведомление в VK Teams/ICQ через Bot API

## Входные параметры

| Параметр       | Обязательность |                    Описание                     | Значение по-умолчанию         |
|----------------|:--------------:|:-----------------------------------------------:|:------------------------------|
| **api-url**    |    **true**    |           Bot API URL (ICQ/VK Teams)            | https://myteam.mail.ru/bot/v1 |
| **bot-token**  |    **true**    |                    Bot token                    | -                             |
| **chat-id**    |    **true**    | ID чата, в который должны приходить уведомления | -                             |
| **msg-text**   |     false      |                 Текст сообщения                 | См. ниже                      |
| **parseMode**  |     false      |              Режим форматирования               | HTML                          |
| **files-path** |     false      |     Путь к файлу, который надо отправить        | -                             |

## Формат сообщения по-умолчанию

```
USER did some changes in repository

- author:
    email: EMAIL
    name: NAME
  committer:
    email: EMAIL
    name: NAME
  distinct: true
  id: HASH
  message: ***
  timestamp: 1970-02-21T20:07:23+03:00
  tree_id: HASH
  url: https://github.com/LOGIN/REPO/commit/HASH
```

## Выходные параметры

## `result`

Результат запроса на отправку уведомления

```json
{"ok": true, "msgId": "214125315135335"}
```

В случае ошибки:

```json
{"ok": false, "error": "Error description"}
```

## Пример использования

```yaml
on: [push]

jobs:
  hello_world_job:
    runs-on: ubuntu-latest
    name: Testing notify
    steps:
      - name: Hello world action step
        id: hello
        uses: dasshit/myteam-notify@v1.0
        with:
          api-url: ${{ secrets.BOTAPI }}
          bot-token: ${{ secrets.BOTTOKEN }}
          chat-id: ${{ secrets.CHATID }}
      # Use the output from the `hello` step
      - name: Get the output result
        run: echo "The time was ${{ steps.hello.outputs.result }}"
```
