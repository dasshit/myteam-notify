# myteam-notify javascript action

Fast way to send notification via ICQ/Myteam Bot API

## Inputs

## `api-url`

**Required** 
Bot API URL (ICQ/Myteam). 
Default `"World"`.

## `bot-token`

**Required**
Bot token.

## `chat-id`

**Required**
Notification chat ID (or stamp from chat URL).

## `msg-text`

Notification text. Default will send msg with next format

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


```html
<code><a href="${github.sender.html_url}">${github.sender.login}</a> did some changes in repository

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
</code>
```

## `parseMode`

Msg text formatting mode

## Outputs

## `result`

Result of sending notification

## Example usage

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
