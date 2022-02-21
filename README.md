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

Notification text

## Outputs

## `result`

Result of sending notification

## Example usage

uses: actions/myteam-notify@v1.1<br>
with:<br>&nbsp;&nbsp;
who-to-greet: 'Mona the Octocat'
