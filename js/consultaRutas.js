
console.log("criscris")

const map = L.map('map').setView([-9.061512787999959, -76.07550594599996], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  atribution: '&copy <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map)

L.control.locate({
  position: 'topleft', // o 'topright'
  strings: {
    title: "Mostrar mi ubicación"
  },
  flyTo: true,
}).addTo(map);



const dataArtifical = await fetch("data/rutasArtificales.json").then(r => r.json());


for (const element of dataArtifical) {
  L.geoJSON(element, {
    style:  obtenerColorAletori(),
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`
                    <strong>${feature.properties.cCodRuta}</strong><br>
                    <strong>${feature.properties.Id}</strong><br>
                    COD: ${feature.properties.cCodRuta}<br>
                    cClasifica: ${feature.properties.cClasifica}<br>
                    dkmInicio: ${feature.properties.dkmInicio}<br>
                    dkmFinal: ${feature.properties.dkmFinal}<br>
                    DEPA: ${feature.properties.cDepartame}<br>
                    cCodCorLog: ${feature.properties.cCodCorLog}<br>
                    cCodTraCon: ${feature.properties.cCodTraCon}<br>
            `);
    }
  }).addTo(map);
}


function obtenerColorAletori(){

  const lista = ["red","blue","green","orange","purple"]
  const indiceAleatorio = Math.floor(Math.random() * lista.length);

  let pollo = {
        color:lista[indiceAleatorio],
        weight: 5
      }

  console.log(pollo)

  return pollo

}

