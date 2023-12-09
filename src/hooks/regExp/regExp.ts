
 const rgx = (str: string): string[] | boolean => {
    
    if (str === undefined) {
        return false
    }
    const text = str.trimStart()
    const match = text.split(/[, ]+/)
    const result = match.map(e => {
        return e.split("").map((el, index) => {
            return el = index === 0 ? el.toUpperCase() : el
        }).join("")

    })

    if (result) {
        return result
    } else {
        return false
    }

}

export default rgx