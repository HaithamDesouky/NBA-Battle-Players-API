const fetchData = async(searchTerm) => {
    let s = searchTerm

    const response = await axios.get("https://www.thesportsdb.com/api/v1/json/1/searchplayers.php?p=" + s)
        
  

    return response.data.player
};

const root = document.querySelector(".autocomplete");
root.innerHTML = `
<label><b>Choose a player!</b></label>
<input class="input" />
<div class="dropdown">
  <div class="dropdown-menu">
    <div class="dropdown-content results"></div>
  </div>
</div>
`;

const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown")
const resultsWrapper = document.querySelector(".results")


const onInput = async event => {
    const players = await fetchData(event.target.value)

   if(!players.length){
     dropdown.classList.remove("is-active");
     return;
   } 

resultsWrapper.innerHTML = " "
dropdown.classList.add("is-active")


for (let player of players){
    if(player.strSport == "Basketball"){
   

    
    const imgSrc = player.strThumb == null ? "" : player.strThumb;
    const option = document.createElement("a");

    option.classList.add("dropdown-item");
    option.innerHTML = `
    <img src="${imgSrc}" />
    ${player.strPlayer}
    `;

  option.addEventListener("click", () => {
    dropdown.classList.remove("is-active")
    input.value = player.strPlayer
    onPlayerSelect(player)
  })

    resultsWrapper.appendChild(option)
}
}
}

input.addEventListener("input", debounce(onInput, 500))

document.addEventListener("click", event =>{
  if (!root.contains(event.target)){
    dropdown.classList.remove("is-active")
  }
}



)


const onPlayerSelect = async player => {
  const response = await axios.get("https://www.thesportsdb.com/api/v1/json/1/searchplayers.php?p=" + input.value)
document.querySelector("#summary").innerHTML = playerTemplate(response.data)
}
;

const  playerTemplate = (player) => {
  console.log(player.player[0].strDescriptionEN.length)

  const champion = () => {
    if(player.player[0].strDescriptionEN.includes("championship")){
      return "NBA Champion"
    } else {
      return "Ringless"
    }}
    const mvp = () => {
      if(player.player[0].strDescriptionEN.includes("MVP")){
        return "Regular Season MVP"
      } else {
        return "No MVP trophies"
      }
    }
  
  

  return `
  <article class="media">
    <figure class="media-left">
      <p class="image">
    <img src="${player.player[0].strThumb}" />
      <p>
      </figure>
      <div class="media-content">
      <div class="content">
        <h1>${player.player[0].strPlayer}</h1>
        <h4>${player.player[0].strPosition}</h4>
        <p>${player.player[0].strTeam}</p>
      </div>
    </div>
    </article> 
    <article class="notification is-primary">
      <p class="title">${player.player[0].strDescriptionEN.length}</p>
      <P class="subititle"> Historical Relevance </p>
    </article>
    
    <article class="notification is-primary">
    <p class="title">${mvp()}</p>
    <P class="subititle"> MVP Winner? </p>
    </article>

  <article class="notification is-primary">
  <p class="title">${player.player[0].intLoved}</p>
  <P class="subititle"> Fame Rating </p>
  </article>

  <article class="notification is-primary">
  <p class="title">${champion()}</p>
  <P class="subititle"> Championship Experience </p>
 </article>
  `
}
