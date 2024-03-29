const mainContainer = document.getElementById('mainContainer')
const contentContainer = document.getElementById('contentContainer')
const contentMenu = document.getElementById('contentMenu')
const contentBody = document.getElementById('contentBody')

window.onload = () => {
    contentContainer.style.display = 'none'

    fetch("data/tutorials.json")
        .then(response => response.json())
        .then(json => {
            var menu = document.getElementById('menuTutorials')

            json.forEach(item => {
                const div = document.createElement('div')
                div.setAttribute('class', 'card')
                const img = document.createElement('img')
                img.setAttribute('src', 'img/' + item.image)
                const h2 = document.createElement('h2')
                h2.innerHTML = item.title
                const link = document.createElement('button')
                link.setAttribute('onclick', 'getPage(\"' + item.title + '\")')
                link.setAttribute('class', 'btnTutorial')
                link.innerHTML = 'Leia mais'
                div.appendChild(img)
                div.appendChild(h2)
                div.appendChild(link)
                menu.appendChild(div)
            })
        })
        .catch(err => console.log('Error in the request', err))
}

function getPage(page) {
    mainContainer.style.display = "none";
    contentContainer.style.display = 'block'

    fetch("data/" + page + ".json")
        .then(response => response.json())
        .then(json => {
            json.sort(compareByNumber);
            renderMenu(json, page)
            renderBody(json, page)
        })
        .catch(err => console.log('Error in the request', err))
}

function renderMenu(data) {
    const sidenav = document.createElement('div')
    sidenav.setAttribute('class', 'sidenav')

    const divHome = document.createElement('div')
    divHome.setAttribute('id','divHome');
    
    const linkHome = document.createElement('a')
    linkHome.setAttribute('href', 'index.html')

    const logoHome = document.createElement('i')
    logoHome.setAttribute('class', 'fa fa-home')
    logoHome.setAttribute('id', 'logoHome')
    logoHome.setAttribute('style', 'font-size: 50px')

    const summary = document.createElement('h2')
    summary.setAttribute('id', 'summary')
    summary.innerHTML = 'Summary'
    
    linkHome.appendChild(logoHome)
    divHome.appendChild(linkHome)
    sidenav.appendChild(divHome)
    sidenav.appendChild(summary)
    
    data.forEach(item => {
        const li = document.createElement('li')
        li.setAttribute('class', 'summaryItem')
        
        const link = document.createElement('a')
        link.setAttribute('href', '#' + item.title)
        link.setAttribute('class', 'linkMenu')
        link.innerHTML = item.number + ' - ' + item.title
        
        li.appendChild(link)
        sidenav.appendChild(li)
    })
    
    contentMenu.appendChild(sidenav)
}

function renderBody(data, page) {
    const title = document.createElement('h1')
    title.innerHTML = page
    contentBody.appendChild(title)
    
    data.forEach(item => {
        const title = document.createElement('h2')
        title.setAttribute('id', item.title)
        title.innerHTML = item.number + ' - ' + item.title
        contentBody.appendChild(title)
        
        item.content.forEach(ele => {
            createContentAndCode(ele, contentBody)
        });
    })
}

function compareByNumber(a, b) {
    return a.number - b.number;
}

function createContentAndCode(obj, main) {
    const content = document.createElement('pre')
    content.setAttribute('class', 'content')
    content.innerHTML = obj.content
    main.appendChild(content)
    
    if (obj.code != '') {
        const pre = document.createElement('pre')
        const code = document.createElement('code')
        code.innerHTML = obj.code
        pre.appendChild(code)
        main.appendChild(pre)
    }
}

btnTop = document.getElementById("btnTop");

window.onscroll = function() { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
        btnTop.style.display = "block";
        return
    }

    btnTop.style.display = "none";
}

function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}