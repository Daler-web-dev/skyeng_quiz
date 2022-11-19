const baseURL = "http://localhost:8888"

const getQsts = async (which) => {
    const res = await fetch(baseURL + which)
    const data = res.json()

    return data
}

// end
let p = document.querySelector('p')


const createSelect = (options) => {
    let allOpts = ''
    for(let item of options) {
        let opt = `<option value="${item.id}">${item.option}<option/>`

        allOpts += opt
    }

    return allOpts
}

Promise.all([getQsts('/select_questions'), getQsts('/radio_questions')])
    .then(res => {
        let questionTypeOne = res[0][0]
        let questionTypeTwo = res[1][0]

        let replacedTxt = questionTypeOne.question.replace(/<@select@>/g, `<select>${createSelect(questionTypeOne.options)}<select/>`)

        p.innerHTML = `
            ${replacedTxt}
        `
        
        let select = document.querySelector('select')
        
        select.onchange = () => {
            
        }
    })


