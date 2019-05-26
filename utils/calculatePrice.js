const priceTable = {
    A3: {
        black: 100,
        color: 600
    },
    A4: {
        black: 50,
        color: 300
    },
    B5: {
        black: 50,
        color: 300
    }
}

const calculatePrice = (task) => {
    const { startPage, endPage, isColor, copies, pagesPerSheet, size, isSingle } = task;
    const pages = Math.ceil(Math.ceil((endPage - startPage + 1) / pagesPerSheet) * copies * (isSingle?1:0.5));
    const price = pages * priceTable[size][isColor?'color':'black'];
    return price;
}

export default calculatePrice;