function filterPro(element)
{
    const type = element.classList[0];

    localStorage.setItem("ProType", type );

    console.log("ProType", type );
}