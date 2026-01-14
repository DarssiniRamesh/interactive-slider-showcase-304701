#!/bin/bash
cd /home/kavia/workspace/code-generation/interactive-slider-showcase-304701/single_slider_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

