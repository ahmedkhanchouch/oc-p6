async function login(email, password) {
    const url = 'http://localhost:5678/api/users/login';
    const response = await fetch(url, {
        method: 'POST', 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password})});
        if( response.status === 200){
        const responseData = await response.json();
        localStorage.setItem('userId', responseData.userId);
        localStorage.setItem('token', responseData.token);
        let linksmodal = document.querySelector
    }
}

document.querySelector('#contact form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
    location.replace("index.html")
    return false;
})