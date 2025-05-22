import AbstractView from "./AbstractView.js";
import { googleSignIn } from "../scripts/googleSignIn.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Google Sign-In");
  }

  async getHtml() {
    return (await fetch("static/html/googleSignIn.html")).text();
  }

  loadJS() {
    // Load the Google Sign-In script if it's not already loaded
    if (window.google && window.google.accounts && google.accounts.id) {
      googleSignIn(); // SDK already loaded
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = googleSignIn;
      document.head.appendChild(script);
    }
  }

  stopJS() {
    // Optional: clean up if needed when leaving view
  }
}


/*import AbstractView from "./AbstractView.js";
import { googleSignIn } from "../scripts/googleSignIn.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("satori - google sign in");
	}

	async getHtml() {
		return (await fetch("static/html/googleSignIn.html")).text();
	}

	loadJS() {
		googleSignIn();
	}

	stopJS() {
		// Nothing to cleanup
	}
}*/
