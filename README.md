# Times Table Quiz Playground

A web-based quiz playground designed to help kids memorize times tables (2-9, optionally up to 20) in a fun way. It includes accuracy/speed tracking, mistake-focused practice, challenge mode, TTS, and multilingual UI support.

## Key Features
- **Normal / Challenge / Mistake Focus modes**: Challenge mode applies a per-question time limit (1-5 seconds), and Mistake Focus mode builds practice from saved wrong answers.
- **Weighted wrong-answer generation**: Increases the proportion of frequently missed questions when enough history is available (10+ wrong answers).
- **Auto progression**: Automatically moves to the next question after an answer is selected.
- **Multilingual UI**: Korean / English / Chinese / Japanese / Spanish / French / German / Portuguese / Vietnamese / Thai / Indonesian
- **TTS read-aloud**: Per-language voice selection with optional auto-read.
- **Learning history**: Stores the latest 30 sessions, with a growth chart and frequently missed question report.
- **Keyboard input**: Quick answers with number keys `1-4`.

## How to Run
1. Open `index.html` in your browser.
2. Configure language, tables, mode, time limit, and other options.

> It runs as static files without a local server.

## Deployment (GitHub Pages)
- Deploy this project to the root of the `byoh5.github.io` repository.
- Place `index.html`, `style.css`, and `script.js` at the top level of that repository.

## Learning History Storage
- Stores up to 30 recent records in `localStorage`.

## TTS (Read Aloud)
- Uses the Web Speech API.
- Prioritizes default Google voices per language when available.
- Voice can be changed from the dropdown.

## File Structure
- `index.html`: UI structure
- `style.css`: styles
- `script.js`: runtime logic
- `PROGRAM_SPEC.md`: detailed spec

## Customization Tips
- Question count range (default `20`, max `100`): range input settings in `index.html`
- Wrong-answer ratios: `NORMAL_WRONG_RATIO`, `CHALLENGE_WRONG_RATIO` in `script.js`
- Minimum wrong-pool threshold: `WRONG_POOL_MIN`
- Auto-advance timing: `setTimeout` delay values

## License
Free to use for internal or educational purposes.
