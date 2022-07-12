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

window.onload = () => {
    fetch("../git-commands/Git Commands.json")
        .then(response => response.json())
        .then(json => {
            var main = document.getElementById('root')
            
            for(i = 0; i < Object.keys(json).length; i++) {
                var item = Object.keys(json)[i]
                
                const title = document.createElement('h2')
                title.innerHTML = item  
                main.appendChild(title)

                if(json[item].length > 1) {
                    json[item].forEach(ele => {
                        const content = document.createElement('p')
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
