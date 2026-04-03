export const BUILTIN_PRACTICALS = {
  'simple-pendulum': {
    text: `Simple Pendulum Experiment

Objective: To investigate the relationship between the length of a simple pendulum and its period of oscillation, and to determine the acceleration due to gravity (g).

Theory: A simple pendulum consists of a mass (bob) suspended from a fixed point by a light, inextensible string. For small angular displacements (less than 15 degrees), the motion is approximately simple harmonic. The period T depends only on the length L and the acceleration due to gravity g: T = 2*pi*sqrt(L/g). The period is independent of the mass of the bob and the amplitude of oscillation.

Apparatus: Retort stand, clamp, pendulum bob (metal sphere), light inextensible string, metre rule, stopwatch, protractor.

Procedure:
1. Set up the retort stand with the pendulum bob attached to a string.
2. Measure the length L from the point of suspension to the centre of the bob.
3. Displace the bob through a small angle (less than 15 degrees) and release.
4. Using a stopwatch, measure the time for 20 complete oscillations.
5. Calculate the period T = total time / 20.
6. Repeat for different lengths (0.2m to 1.5m).
7. Plot T squared vs L graph - it should be a straight line through the origin.
8. Calculate g from the gradient: g = 4*pi^2 / gradient.

Key Equations: T = 2*pi*sqrt(L/g), omega = sqrt(g/L), theta(t) = theta_0 * cos(omega*t)`,
    title: {
      en: 'Simple Pendulum',
      si: 'සරල පැන්ඩුලමය',
      ta: 'எளிய ஊசல்',
    },
    description: {
      en: 'Investigate the relationship between pendulum length and period of oscillation.',
      si: 'පැන්ඩුලමයේ දිග සහ දෝලන කාලය අතර සම්බන්ධය පරීක්ෂා කරන්න.',
      ta: 'ஊசல் நீளத்திற்கும் அலைவு காலத்திற்கும் இடையேயான தொடர்பை ஆராயுங்கள்.',
    },
    domain: 'mechanics',
  },
  'projectile-motion': {
    text: `Projectile Motion Experiment

Objective: To study the trajectory of a projectile launched at various angles and velocities, and to verify the equations of projectile motion.

Theory: A projectile is any object thrown into the air with an initial velocity v0 at an angle theta to the horizontal. Under gravity alone (ignoring air resistance), the horizontal component of velocity remains constant while the vertical component changes due to gravitational acceleration g. The trajectory is parabolic.

Key equations:
- Horizontal: x(t) = v0 * cos(theta) * t
- Vertical: y(t) = v0 * sin(theta) * t - 0.5 * g * t^2
- Range: R = v0^2 * sin(2*theta) / g
- Maximum height: H = v0^2 * sin^2(theta) / (2*g)
- Time of flight: T = 2 * v0 * sin(theta) / g

Apparatus: Ball launcher, protractor, measuring tape, carbon paper, steel ball, ruler.

Procedure:
1. Set the launch angle using the protractor.
2. Set the initial velocity using the launcher spring tension.
3. Launch the projectile and observe the trajectory.
4. Use carbon paper on the floor to record landing position.
5. Measure the range (horizontal distance from launch point).
6. Repeat for angles from 15 to 75 degrees in 10 degree steps.
7. Identify the angle giving maximum range (should be 45 degrees).
8. Plot trajectory curves for different angles on the same graph.`,
    title: {
      en: 'Projectile Motion',
      si: 'ප්‍රක්ෂේපක චලිතය',
      ta: 'எறிபொருள் இயக்கம்',
    },
    description: {
      en: 'Study the parabolic trajectory of a projectile at various launch angles and velocities.',
      si: 'විවිධ දියත් කිරීමේ කෝණ සහ ප්‍රවේග වලින් ප්‍රක්ෂේපකයක පරාවලයාකාර ගමන් මාර්ගය අධ්‍යයනය කරන්න.',
      ta: 'பல்வேறு ஏவுகோணங்கள் மற்றும் வேகங்களில் எறிபொருளின் பரவளைய பாதையை ஆய்வு செய்யுங்கள்.',
    },
    domain: 'mechanics',
  },
};
