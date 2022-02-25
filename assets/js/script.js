// seleccion de elementos del dom
const heroName = document.querySelector("#hero-name")
const heroImg = document.querySelector("#hero-img")
const heroConnections = document.querySelector("#hero-connections")
const heroPublisher = document.querySelector("#hero-publisher")
const heroOccupation = document.querySelector("#hero-occupation")
const heroFirstAppearance = document.querySelector("#hero-first-appearance")
const heroHeight = document.querySelector("#hero-height")
const heroWeight = document.querySelector("#hero-weight")
const heroAliases = document.querySelector("#hero-aliases")
const card = document.querySelector("#card")

//
const form = document.querySelector("#form")
const heroInput = document.querySelector("#hero-input")

form.addEventListener("submit", (e) => {
	e.preventDefault()
	const valueInput = heroInput.value
	const patron = /[0-9]/gim
	if (valueInput.match(patron)) {
		fetch(
			"https://www.superheroapi.com/api.php/4905856019427443/" + valueInput
		).then((respuesta) => {
			respuesta.json().then((data) => {
				// asignando variables a los datos entregados por el json
				const name = data.name
				const image = data.image.url
				let connections = data.connections
				connections = Object.values(connections)[0]
				const publisher = data.biography.publisher
				const occupation = data.work.occupation
				const firstAppearance = data.biography["first-appearance"]
				const height = data.appearance.height
				const weight = data.appearance.weight
				const aliases = data.biography.aliases
            const powers = data.powerstats

				// escribe resultados en el dom
				card.classList.add("card")
				heroName.innerHTML = `<span class="fw-bold">Name:</span> ${name}`
				heroImg.innerHTML = `<img src="${image}" class="img-fluid rounded-start">`
				heroConnections.innerHTML = `<span class="fw-bold">Connections:</span> ${connections}`
				heroPublisher.innerHTML = `<span class="fw-bold">Publisher: ${publisher}</span>`
				heroOccupation.innerHTML = `<span class="fw-bold">Occupation:</span> ${occupation}`
				heroFirstAppearance.innerHTML = `<span class="fw-bold">First Appearance:</span> ${firstAppearance}`
				heroHeight.innerHTML = `<span class="fw-bold">Height:</span> ${height}`
				heroWeight.innerHTML = `<span class="fw-bold">Weight:</span> ${weight}`
				heroAliases.innerHTML = `<span class="fw-bold">Aliases:</span> ${Object.values(aliases)}`

				// canvasjs settings
				const config = {
					theme: "dark1",
               animationEnabled : true,
					backgroundColor: "transparent",
               title: {
                  text: "Powers stats"
               },
               data: [{
                     type: "pie",
							startAngle: 25,
                     toolTipContent: "<b>{label}</b>: {y}%",
							showInLegend: "true",
							legendText: "{label}",
							indexLabelFontSize: 16,
							indexLabel: "{label} - {y}%",
							dataPoints: [
								{ y: powers.intelligence, label: "Intelligence" },
								{ y: powers.strength, label: "Strength" },
								{ y: powers.speed, label: "Speed" },
								{ y: powers.durability, label: "Durability" },
								{ y: powers.power, label: "Power" },
								{ y: powers.combat, label: "Combat" },
							]
                  }]
            }
            var chart = new CanvasJS.Chart("hero-stats", config)
            chart.render()
			})
		})
	} else {
		alert("solo se permiten numeros como input")
	}
})
