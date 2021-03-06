//gets var / from url
var action = getParameterByName('/')

//sets title to page + site name


if (action == null) {
    if (getParameterByName('page')) {
        action = getParameterByName('page');
    } else {
        action = "home";
    }

}

document.title = "Fleet science | " + action;

// the ghetto way of (m)vc
switch (action) {



    // Sailor views
    case "dashboard-sailor":
        view("menu/_menu-sailor.html");
        view("dashboard/_dashboard-sailor.html");
        break;

    case "all-requests-sailor":
        view("menu/_menu-sailor.html");
        view("functional-pages/_all-requests-sailor-localstorage-example.html");
        break;

    case "accepted-requests-sailor":
        view("menu/_menu-sailor.html");
        view("functional-pages/_accepted-requests-sailor-localstorage-example.html");
        break;

    case "chatbox-sailor":
        view("menu/_menu-sailor.html");
        view("functional-pages/_chatbox.html");
        break;

    // Academic
    case "dashboard-academic":
        view("menu/_menu-academic.html");
        view("dashboard/_dashboard-academic.html");
        break;

    case "chatbox-academic":
        view("menu/_menu-academic.html");
        view("functional-pages/_chatbox-academic.html");
        break;


    case "my-requests-academic":
        view("menu/_menu-academic.html");
        view("functional-pages/_my-requests-academic-localstorage.html");
        break;

    case "all-requests-academic":
        view("menu/_menu-academic.html");
        view("functional-pages/_all-requests-localstorage-academic.html");
        break;

    case "accepted-requests-academic":
        view("menu/_menu-academic.html");
        view("functional-pages/_accepted-requests-academic.html");
        break;

    case "download-app":
        view("menu/_menu-sailor.html");
        view("feedback/_download-app.html");
        break;

    case "profile":
        view("menu/_menu-sailor.html");
        view("static-pages/_profile.html");
        break;

    case "profile-academic":
        view("menu/_menu-academic.html");
        view("static-pages/_profile-academic.html");
        break;

    case "variables":
        view("menu/_menu-sailor.html");
        view("static-pages/_variables.html");
        break;

    case "editpassword":
        view("menu/_menu-sailor.html");
        view("static-pages/_edit-password.html");
        break;

    case "home":
        view("menu/_menu.html");
        view("static-pages/_home.html");
        view("menu/_footer.html");
        break;

    case "login":
        view("menu/_menu.html");
        view("forms/_login.html");
        break;

    case "account-created":
        view("menu/_menu.html");
        view("static-pages/_account-created.html");
        break;

    case "sign-up":
        view("menu/_menu.html");
        view("forms/_sign-up.html");
        break;

    case "about":
        view("menu/_menu.html");
        view("static-pages/_about.html");
        view("menu/_footer.html");
        break;
    case "database":
        view("menu/_menu.html");
        view("static-pages/_database.html");
        break;
    default:
        view("error/_home.html");
        break;
    case "database-logged-in-academic":
        view("menu/_menu-academic.html");
        view("static-pages/_database-logged-in.html");
        break;
    case "database-logged-in-sailor":
        view("menu/_menu-sailor.html");
        view("static-pages/_database-logged-in.html");
        break;
    case "forgot-password":
    view("menu/_menu.html");
    view("static-pages/_forgot-password.html");
        break;

    case "requested-academic":
        view("menu/_menu-academic.html");
        view("feedback/requested-academic.html")

}
