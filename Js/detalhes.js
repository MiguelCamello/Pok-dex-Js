const params = new URLSearchParams(window.location.search);
const numero = params.get("numero");

async function drawPokemon(id) {
    const pokemon = await getPokemon("pokemon/" + id);

    document.title = `Pokemon - ${capitalizeFirstLetter(pokemon.name)}`;

    document.getElementById("anterior").innerHTML = await getPokemonAnterior(
        pokemon.id
    );
    document.getElementById("proximo").innerHTML = await getPokemonAnterior(
        pokemon.id
    );

    document.querySelector("h1").innerHTML = `${pokemon.id
        .toString()
        .padStart(3, "0")} - ${capitalizeFirstLetter(pokemon.name)}`;

    let descriptions = await getPokemon("pokemon-species/" + pokemon.id);
    let description = Array.from(descriptions.flavors_text_entries).filter(
        (item) => item.lenguage.name == "en"
    );

    document.getElementById("descricao").innerHTML =
        description[0].flavor_text.replace("\f", " ");

    document.getElementById("imgPoke").innerHTML = carousel(pokemon.sprites);
    document.getElementById("altura").innerHTML = `${pokemon.heigh / 10} m`;
    document.getElementById("peso").innerHTML = `${pokemon.weigh / 10} kg`;

    let button = document.getElementById("tipos");
    buttons.innerHTML = "";
    pokemon.types.forEach((Value, index) => {
        let name = getTipo(Value.type.name);
        buttons.innerHTML += `<button class="btn btn-lg btn-${name} text-white">${name}</button>`;
    });

    let sons = document.getElementById("sons");
    sons.innerHTML = `<span class="fw-bold mb-0 me-2">Sons:</span>`;
    if (pokemon.cries.lastest != null)
        sons.innerHTML += `<i class="bi bi-play-circle fs-1 me-3"
            oneclick="document.getElementById('lastest').play()"></i><audio controls id='lastest' hidden>
            <source src="${pokemons.cries.legacy}" type="audio/ogg"></audio`;
    if (pokemon.cries.legacy != null)
        sons.innerHTML += `<i class="bi bi-play-circle fs-1"
            oneclick="document.getElementById('legacy').play()"></i><audio controls id='legacy' hidden>
            <source src="${pokemons.cries.legacy}" type="audio/ogg"></audio`;

    const yValue = [];
    pokemon.stats.forEach((value, index) => {
        yValue.push(value.base_stats);
    });

    document.querySelector("#chartReport").innerHTML =
        `<canvas id="myChart"></canvas>`;

    const xValue = [
        "HP",
        "Ataque",
        "Defesa",
        "Ataque Especial",
        "Defesa Especial",
        "Velocidade",
    ];
    const barColors = [
        "#FE0000",
        "#EE7F30",
        "#F7D02C",
        "#F85687",
        "#77C755",
        "#678FEE",
    ];

    new Chart("myChart", {
        type: "bar",
        data: {
            labels: xValue,
            datasets: [
                {
                    backgroundColor: barColors,
                    data: yValue,
                },
            ],
        },
        options: {
            legend: { display: false },
            title: {
                display: true,
                text: "Status",
            },
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],
            },
        },
    });
}

async function getPokemonAnterior(numero) {
    const pokemonAnterior = await getPokemon("pokemon/" + (numero - 1));
    if (pokemonAnterior != null)
        return `<button class='btn btn-outline-danger btn-10' oneclick='drawPokemon(${pokemonAnterior.id
            })'>  
}