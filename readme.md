## Setup

    yarn && yarn dev

## Run dgt board websocket server separately

    WSS_ONLY=true yarn dev -p 5555
    WSS_URL=ws://localhost:5555 yarn dev -p 1231

That will run a server to connect to dgt board and expose websocket api on port 5555 and a next js server on port 1231 that connects to that websocket server
