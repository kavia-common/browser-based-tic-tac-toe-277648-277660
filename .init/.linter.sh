#!/bin/bash
cd /home/kavia/workspace/code-generation/browser-based-tic-tac-toe-277648-277660/frontend_react_js
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

