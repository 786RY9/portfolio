/**
 * Intro loader timing + the inline <head> script that decides, before first paint,
 * whether the intro plays. Kept out of the "use client" loader module so the
 * server layout can import the script as a plain string.
 *
 * Plays only when: landing directly on "/", no prefers-reduced-motion, and not
 * yet shown this browser session (sessionStorage; any storage error => skip).
 *
 * Keep the timings in sync with .intro-loader in app/globals.css.
 */
export const INTRO_COUNT_MS = 700
export const INTRO_TOTAL_MS = 1150

export const INTRO_SCRIPT = `(function(){try{var d=document.documentElement;if(location.pathname!=="/")return;if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return;if(sessionStorage.getItem("ry_intro_seen"))return;sessionStorage.setItem("ry_intro_seen","1");window.__ryIntroStart=performance.now();d.setAttribute("data-intro","play")}catch(e){}})();`
