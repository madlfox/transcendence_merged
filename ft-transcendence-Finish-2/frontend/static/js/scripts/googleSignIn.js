// ✅ Define the callback FIRST so Google can find it immediately
window.handleGoogleLogin = async function (response) {
	const idToken = response.credential;
  
	try {
	  const res = await fetch("/api/google-login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id_token: idToken }),
	  });
  
	  const result = await res.json();
	  console.log("[Google Sign-In] Backend response:", result);
  
	  if (result.token) {
		localStorage.setItem("auth_token", result.token);
		window.location.href = "/profile";
	  } else {
		alert("❌ Login failed or no token returned.");
	  }
	} catch (err) {
	  console.error("❌ Error during Google login:", err);
	  alert("Login error. See console for details.");
	}
  };
  
  // ✅ Call this after the Google SDK has loaded
  export function googleSignIn() {
	if (window.google && google.accounts && google.accounts.id) {
	  // Initialize Google Sign-In
	  google.accounts.id.initialize({
		client_id: "533060755960-kfel2q1fm958u6ui38mooe5psojci4tr.apps.googleusercontent.com",
		callback: handleGoogleLogin,
	  });
  
	  // Render the button
	  google.accounts.id.renderButton(
		document.querySelector(".g_id_signin"),
		{
		  theme: "outline",
		  size: "large",
		  text: "sign_in_with",
		  shape: "rectangular",
		}
	  );
	} else {
	  console.error("Google Sign-In SDK not available.");
	}
  }
  


/*export function googleSignIn() {
	window.handleGoogleLogin = async function (response) {
	  const idToken = response.credential;
  
	  const res = await fetch("/api/google-login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id_token: idToken }),
	  });
  
	  const result = await res.json();
	  console.log("[Google Sign-In] Server response:", result);
  
	  if (result.token) {
		localStorage.setItem("auth_token", result.token);
		window.location.href = "/profile";
	  } else {
		alert("❌ Login failed or token missing.");
	  }
	};
  }*/
  

/*import { navigateTo } from "../index.js";

export function googleSignIn() {
	window.handleGoogleLogin = async function (response) {
		const idToken = response.credential;

		const res = await fetch("/api/google-login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id_token: idToken })
		});

		const container = document.querySelector('.container-login');

		if (res.status === 200) {
			const data = await res.json();
			if (data.token) {
				localStorage.setItem("auth_token", data.token);
				navigateTo("/profile");
			} else {
				container.innerHTML = `
					<div class="error text-center">
						<h5 class="text-white">Google login succeeded, but no token received.</h5>
					</div>`;
			}
		} else {
			container.innerHTML = `
				<div class="error text-center">
					<h5 class="text-white">Google login failed</h5>
				</div>`;
		}
	};
}*/
