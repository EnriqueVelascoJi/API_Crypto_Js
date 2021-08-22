
const criptomonedasSelect = document.getElementById( "criptomonedas" );
const monedaSelect = document.getElementById( "moneda" );
const formulario = document.getElementById( "formulario" );
const resultado = document.getElementById( "resultado" );

const obj = {
    moneda: '',
    criptomoneda: ''
};

const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve( criptomonedas );
} );

document.addEventListener( "DOMContentLoaded", () => {

    consultarCriptomonedas();


    formulario.addEventListener( "submit", submitFormulario );

    criptomonedasSelect.addEventListener( "change", leerValor );
    monedaSelect.addEventListener( "change", leerValor );

})

async function consultarCriptomonedas() {

    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    try {
        
        const response = await fetch( url );
        const data = await response.json();
        const criptomonedas = await obtenerCriptomonedas( data.Data );
        selectCriptomonedas( criptomonedas );

    } catch (error) {
        console.log( error );
    }

    // fetch( url )
    //     .then( res => res.json() )
    //         .then( data => obtenerCriptomonedas( data.Data) )
    //             .then( criptomonedas => selectCriptomonedas( criptomonedas ) )
}

function selectCriptomonedas( criptomonedas ) {

    criptomonedas.forEach( cripto => {
        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement( "option" );
        option.value = Name;
        option.textContent = FullName;

        criptomonedasSelect.appendChild( option )
    });
}

function leerValor( e ) {

    obj[ e.target.name ] = e.target.value;
    
}

function submitFormulario( e ) {
    e.preventDefault();

    const { moneda, criptomoneda } = obj;

    if( moneda === "" || criptomoneda === "" ){
        mostrarAlerta( "Ambos campos son obligatorios" );
        return;
    }

    consultarAPI();

}

function mostrarAlerta( msg ) {

    const existeError = document.querySelector( ".error" );
    if( !existeError) {
        const divMensaje = document.createElement( "div" );
        divMensaje.classList.add( "error" );
    
        divMensaje.textContent = msg;
    
        formulario.appendChild( divMensaje );
    
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);

    }
}

async function consultarAPI() {

    const { moneda, criptomoneda } = obj;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${ criptomoneda }&tsyms=${ moneda }`;

    mostrarSpinner();
     
    // fetch( url )
    //     .then( response => response.json() )
    //         .then( data => mostrarCotizacion( data.DISPLAY[ criptomoneda ][ moneda ] ))

    try {
        
        const response = await fetch(url);
        const data  = await response.json();
        mostrarCotizacion( data.DISPLAY[ criptomoneda ][ moneda ] );

    } catch (error) {
        console.log( error );
    }

}

function mostrarCotizacion( cotizacion ) {

    limpiarHTML();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    const precio = document.createElement( "p" );
    precio.classList.add( "precio" );
    precio.innerHTML = `El precio es: <span>${ PRICE }</span>`;


    const precioAlto = document.createElement( "p" );
    precioAlto.innerHTML = `El precio mas alto del día es: <span>${ HIGHDAY }</span>`;
    
    const precioBajo = document.createElement( "p" );
    precioBajo.innerHTML = `El precio mas bajo del día es: <span>${ LOWDAY }</span>`;
    
    const ultimasHoras = document.createElement( "p" );
    ultimasHoras.innerHTML = `Variación ultimas 24 hrs: <span>${CHANGEPCT24HOUR }% </span>`;
    
    const ultimaActualizacion = document.createElement( "p" );
    ultimaActualizacion.innerHTML = `La última actualización es: <span>${ LASTUPDATE }</span>`;
    
    

    resultado.appendChild( precio );
    resultado.appendChild( precioAlto );
    resultado.appendChild( precioBajo );
    resultado.appendChild( ultimasHoras );
    resultado.appendChild( ultimaActualizacion );

}

function limpiarHTML() {

    while( resultado.firstChild ) {
        resultado.removeChild( resultado.firstChild );
    }
}

function mostrarSpinner() {

    limpiarHTML();

    const spinner = document.createElement( "div" );
    spinner.classList.add( "spinner" );

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.appendChild( spinner );
}