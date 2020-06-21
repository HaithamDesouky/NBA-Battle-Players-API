const autoCompleteConfig = {
  renderOption(player) {
    const imgSrc = player.strThumb == null ? "" : player.strThumb;
    return `
    <img src="${imgSrc}" />
    ${player.strPlayer}
    `;
  },

inputValue(player){
  console.log(player.strPlayer)
  return player.strPlayer
},
async fetchData(searchTerm) {
  const response = await axios.get("https://www.thesportsdb.com/api/v1/json/1/searchplayers.php?p=" + searchTerm)
console.log(response.data.player)
return response.data.player
}

}

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect(player){
    document.querySelector(".tutorial").classList.add("is-hidden")

    onPlayerSelect(player, document.querySelector("#left-summary"));
  }

});

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect(player){
    document.querySelector(".tutorial").classList.add("is-hidden")

    onPlayerSelect(player, document.querySelector("#right-summary"));
  }


});


const onPlayerSelect = async (player, summaryElement) => {
  const response = await axios.get("https://www.thesportsdb.com/api/v1/json/1/searchplayers.php?p=" + player.strPlayer

  )
    

console.log(player.strPlayer)
summaryElement.innerHTML = playerTemplate(response.data)
};

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
