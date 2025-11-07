

console.log('helloo!')

const button = document.getElementById('searchbutton');
const textbox = document.getElementById('searchbox');
const results = document.getElementById('searchresults');


function formatToTableCompatibleFormat(jsonResponse) {
    return jsonResponse.map( (item) => {
        return `<tr> 
                    <th>
                        <a href=${item[0]}>${item[0].split('/').at(-1)} </a>
                    </th> 
                    <th>
                        ${item[1]} ${item[1] ===1? 'Match' : 'Matches'} 
                    </th> 
                </tr>`
            })
        .join('')
}


var lastInputTimestamp = performance.now();

textbox.oninput = () => {
    console.log('wdawd')
    lastInputTimestamp = performance.now();
    setTimeout(() => {
        
        if (performance.now() -  lastInputTimestamp < 400) {
            return //hacky, prevents flooding of useless http requests
        }
        lastInputTimestamp = performance.now();

        
        const query = textbox.value;
        if (query == '') {
            results.innerHTML = ''
        }
        const urlParams = new URLSearchParams(
            {
                'q' : query
            }
        ).toString()

        fetch('/search?' + urlParams).then(
                async (response) => {
                    if (!response.ok) {
                        return
                    }

                    const jsonResponse = await response.json()
                    console.log(jsonResponse,formatToTableCompatibleFormat(jsonResponse))
                    results.innerHTML = formatToTableCompatibleFormat(jsonResponse)
                }
            )
        },500)
}