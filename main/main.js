window.onload = () => {
    fetch("main/tutorials.json")
        .then(response => response.json())
        .then(json => {
            var menu = document.getElementById('menuTutorials')

            json.forEach(ele => {
                const li = document.createElement('li')
                li.setAttribute('class', 'liTutorial')
                const link = document.createElement('button')
                link.setAttribute('id', ele)
                link.setAttribute('onclick', 'getPage(\"'+ele+'\")')
                link.innerHTML = ele
                li.appendChild(link)
                menu.appendChild(li)
            })
        })
        .catch(err => console.log('Error in the request', err))
}

function getPage(page) {
    var container = document.getElementById('container')
    container.style.display = "none";

    fetch("data/" + page + ".json")
        .then(response => response.json())
        .then(json => {
            // SUMMARY
            var menu = document.getElementById('menu')

            const sidenav = document.createElement('div')
            sidenav.setAttribute('class', 'sidenav')

            const home = document.createElement('div')
            home.setAttribute('id','home');
            
            const backHome = document.createElement('a')
            backHome.setAttribute('href', 'index.html')

            const logoHome = document.createElement('img')
            logoHome.setAttribute('src', 'https://img.icons8.com/ios-glyphs/90/EBEBEB/home-page--v1.png')
            logoHome.setAttribute('width', '50px')

            backHome.appendChild(logoHome)
            home.appendChild(backHome)
            sidenav.appendChild(home)

            const summary = document.createElement('h2')
            summary.setAttribute('id', 'summary')
            summary.innerHTML = 'Summary'
            sidenav.appendChild(summary)
            
            Object.keys(json).forEach(ele => {
                const li = document.createElement('li')
                li.setAttribute('class', 'summaryItem')
                const link = document.createElement('a')
                link.setAttribute('href', '#' + ele)
                link.innerHTML = ele
                li.appendChild(link)
                sidenav.appendChild(li)
            })

            menu.appendChild(sidenav)

            // CONTENT
            var main = document.getElementById('root')

            const title = document.createElement('h1')
            title.innerHTML = 'Git Commands'
            main.appendChild(title)
            
            for(i = 0; i < Object.keys(json).length; i++) {
                var item = Object.keys(json)[i]
                
                const title = document.createElement('h2')
                title.setAttribute('id', item)
                title.innerHTML = item
                main.appendChild(title)

                if(json[item].length > 1) {
                    json[item].forEach(ele => {
                        const content = document.createElement('p')
                        content.setAttribute('class', 'content')
                        content.innerHTML = ele.content
                        
                        const code = document.createElement('code')
                        code.innerHTML = ele.code
                        
                        main.appendChild(content)
                        main.appendChild(code)
                    });
                } else {
                    const content = document.createElement('p')
                    content.innerHTML = json[item][0].content
                    
                    const code = document.createElement('code')
                    code.innerHTML = json[item][0].code
                    
                    main.appendChild(content)
                    main.appendChild(code)
                }
            }
        })
        .catch(err => console.log('Error in the request', err))
}

btnTop = document.getElementById("btnTop");

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        btnTop.style.display = "block";
    } else {
        btnTop.style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}