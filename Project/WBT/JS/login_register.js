// login and register script
function change() {
    const password_group = document.getElementById("password_group");

    if (document.getElementsByTagName("h2")[0].innerText == "SIGN IN" ){
        // change sign in to sign up
        document.getElementsByTagName("h2")[0].innerHTML = "SIGN UP";
        document.getElementById("sign_up").innerHTML = "Sign In";
        
        // hidden forget password field
        document.getElementById("forget_password").style.display = "None";
        
        // create a new field to confirm the password
        var div = document.createElement("div");
        div.classList.add("form-group");
        div.id = "confirm_password_div"
        var span = document.createElement("span");
        span.classList.add("login_icons");
        var icon = document.createElement("i");
        icon.classList.add("fa-solid");
        icon.classList.add("fa-lock");
        var input = document.createElement("input");
        input.classList.add("form-control");
        input.type = "password";
        input.placeholder = "Confirm Password";
        input.id = "login_confirm_password";
        input.required = true;
        span.appendChild(icon);
        div.appendChild(span);
        div.appendChild(input);
        password_group.appendChild(div);
    } else {
        // change sign up to sign in
        document.getElementsByTagName("h2")[0].innerHTML = "SIGN IN";
        document.getElementById("sign_up").innerHTML = "Sign Up";
        
        // show forget password field
        document.getElementById("forget_password").style.display = "Block";
        
        // remove confirm password field
        document.getElementById("confirm_password_div").remove();
    }
}

document.getElementById("sign_up").addEventListener("click", change);

function next() {

    // if sign in mode -> check if email and password are ok in db
    if (document.getElementsByTagName("h2")[0].innerText == "SIGN IN" ){
    } 
    // if sign up mode -> check if email doesn't exist em db and if password and password_confirm are equals
    else {

    }
}