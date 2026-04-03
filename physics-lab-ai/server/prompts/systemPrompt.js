export const ANALYSIS_PROMPT = `You are a senior physics educator. Read the text from a student's physics practical and produce a structured JSON description.

Return ONLY valid JSON. No markdown, no backticks, no commentary.

JSON SCHEMA:
{
  "title": "string",
  "domain": "optics | mechanics | thermodynamics | electricity | waves | fluid",
  "governing_equations": ["equation strings"],
  "parameters": [
    { "name": "string", "symbol": "string", "unit": "string", "min": number, "max": number, "default": number, "step": number }
  ],
  "observables": [
    { "name": "string", "symbol": "string", "unit": "string", "formula_description": "string" }
  ],
  "setup_description": "string",
  "visual_elements": ["strings describing what to draw"],
  "animation_type": "trajectory | oscillation | ray_diagram | circuit | static_graph"
}

Include at least 3 parameters and 3 observables. Return ONLY the JSON.

Now analyze the following text and return ONLY the JSON:`;


export const GENERATION_PROMPT = `Generate a single self-contained HTML file that creates an interactive physics simulation. The simulation must be visually impressive, physically accurate, and fully interactive.

STRICT OUTPUT: Start with <!DOCTYPE html>, end with </html>. No markdown, no backticks. Zero CDN imports. Pure HTML/CSS/JS/Canvas.

The HTML file must contain:
1. A large canvas (100% width, 550px height) showing the experiment apparatus with animation
2. Range sliders for each parameter that update the simulation in real-time (use oninput)
3. Numerical readouts for all observables, updated every frame
4. Play/Pause and Reset buttons
5. A live graph (second canvas, 100% width, 200px height) plotting the key relationship

SIMULATION QUALITY GUIDELINES:
- Draw apparatus LARGE - objects should fill most of the canvas
- Use lineWidth 3-4 for outlines, bold 16px+ font for labels
- Show measurement values ON the canvas with units (e.g. "L = 1.50 m")
- Draw dimension lines with arrowheads for key distances
- Use bright, distinct colors: blue #3b82f6 for main objects, red #ef4444 for forces, green #22c55e for trails, yellow #eab308 for light rays, purple #a855f7 for velocity vectors
- Animate smoothly with requestAnimationFrame and dt = Math.min((now-last)/1000, 0.05)
- Store trail points (max 500) and draw them with fading opacity
- Clear and redraw everything each frame
- When sliders change: reset time to 0, clear trails, recalculate
- Handle physics edge cases (division by zero, etc.)
- Use dark background (#0f172a) for the canvas with white/bright elements for maximum contrast
- Draw grid lines at rgba(255,255,255,0.06)

The live graph should:
- Auto-scale axes to fit data
- Plot with green line and blue dots
- Show axis labels and title
- Clear when parameters change

Generate the complete simulation for this experiment:`;
