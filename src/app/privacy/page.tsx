import { Box, Heading, Text, ListItem, Link, List } from "@chakra-ui/react";

export default function Privacy() {
  return (
    <Box maxWidth="800px" mx="auto" p="8" bg="white" color="gray.800" borderRadius="md" boxShadow="md">
      <Heading letterSpacing={"tighter"} as="h1" size="2xl" mb="6" textAlign="center" color="gray.800" fontFamily={"Archivo Black"}>
        Política de privacidad de Busy
      </Heading>
      <Text>
        Esta Política de privacidad describe cómo se recopila, utiliza y comparte su información personal cuando visita o hace una compra en https://www.busy.com.ar/ (denominado en lo sucesivo el “Sitio”).
      </Text>

      <Heading as="h2" size="lg" mt="8" mb="4" color="gray.800" >
        INFORMACIÓN PERSONAL QUE RECOPILAMOS.
      </Heading>
      <Text mb="4">
        Cuando visita el Sitio, recopilamos automáticamente cierta información sobre su dispositivo, incluida información sobre su navegador web, dirección IP, zona horaria y algunas de las cookies que están instaladas en su dispositivo. Además, a medida que navega por el Sitio, recopilamos información sobre las páginas web individuales o los productos que ve, las páginas web o los términos de búsqueda que lo remitieron al Sitio e información sobre cómo interactúa usted con el Sitio. Nos referimos a esta información recopilada automáticamente como “Información del dispositivo”.
      </Text>
      <Text mb="4">
        Recopilamos Información del dispositivo utilizando las siguientes tecnologías:
      </Text>
      <List.Root pl="4" mb="4">
        <ListItem>
          Los “Archivos de registro” rastrean las acciones que ocurren en el Sitio y recopilan datos, incluyendo su dirección IP, tipo de navegador, proveedor de servicio de Internet, páginas de referencia/salida y marcas de fecha/horario.
        </ListItem>
        <ListItem>
          Las “balizas web”, las “etiquetas” y los “píxeles” son archivos electrónicos utilizados para registrar información sobre cómo navega usted por el Sitio.
        </ListItem>
      </List.Root>
      <Text>
        Además, cuando hace una compra o intenta hacer una compra a través del Sitio, recopilamos cierta información de usted, entre la que se incluye su nombre, dirección de facturación, dirección de envío, información de pago (incluidos los números de la tarjeta de crédito [[INSERTAR CUALQUIER OTRO TIPO DE PAGO ACEPTADO]]), dirección de correo electrónico y número de teléfono.  Nos referimos a esta información como “Información del pedido”.
      </Text>
      <Text>
        Cuando hablamos de “Información personal” en la presente Política de privacidad, nos referimos tanto a la Información del dispositivo como a la Información del pedido.
      </Text>

      <Heading as="h2" size="lg" mt="8" mb="4" color="gray.800" >
        ¿CÓMO UTILIZAMOS SU INFORMACIÓN PERSONAL?
      </Heading>
      <Text >
        Usamos la Información del pedido que recopilamos en general para preparar los pedidos realizados a través del Sitio (incluido el procesamiento de su información de pago, la organización de los envíos y la entrega de facturas y/o confirmaciones de pedido).  Además, utilizamos esta Información del pedido para: comunicarnos con usted;
      </Text>
      <Text mb="4">
        examinar nuestros pedidos en busca de fraudes o riesgos potenciales; y cuando de acuerdo con las preferencias que usted compartió con nosotros, le proporcionamos información o publicidad relacionada con nuestros productos o servicios.
      </Text>

      <Text>
        Utilizamos la Información del dispositivo que recopilamos para ayudarnos a detectar posibles riesgos y fraudes (en particular, su dirección IP) y, en general, para mejorar y optimizar nuestro Sitio (por ejemplo, al generar informes y estadísticas sobre cómo nuestros clientes navegan e interactúan con el Sitio y para evaluar el éxito de nuestras campañas publicitarias y de marketing).
      </Text>

      <Text>
        utilizamos Google Analytics para ayudarnos a comprender cómo usan nuestros clientes el Sitio. Puede obtener más información sobre cómo Google utiliza su Información personal aquí: https://www.google.com/intl/es/policies/privacy/.  Puede darse de baja de Google Analytics aquí: https://tools.google.com/dlpage/gaoptout.

        Finalmente, también podemos compartir su Información personal para cumplir con las leyes y regulaciones aplicables, para responder a una citación, orden de registro u otra solicitud legal de información que recibamos, o para proteger nuestros derechos.
      </Text>

      <Heading as="h2" size="lg" mt="8" mb="4" color="gray.800" >
        PUBLICIDAD ORIENTADA POR EL COMPORTAMIENTO
      </Heading>
      <Text>
        Como se describió anteriormente, utilizamos su Información personal para proporcionarle anuncios publicitarios dirigidos o comunicaciones de marketing que creemos que pueden ser de su interés.  Para más información sobre cómo funciona la publicidad dirigida, puede visitar la página educativa de la Iniciativa Publicitaria en la Red ("NAI" por sus siglas en inglés) en http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work.
      </Text>
      <Text>
        Puede darse de baja de la publicidad dirigida mediante los siguientes enlaces:
      </Text>

      <List.Root gap="2" mt={4} pl="4" mb="4">
        <ListItem>
          <Link href="https://www.facebook.com/settings/?tab=ads" color="blue.500" >
            Configurar anuncios en Facebook
          </Link>
        </ListItem>
        <ListItem>
          <Link href="https://adssettings.google.com/authenticated?hl=es" color="blue.500" >
            Configurar anuncios en Google
          </Link>
        </ListItem>
        <ListItem>
          <Link href="https://about.ads.microsoft.com/es-es/recursos/directivas/anuncios-personalizados" color="blue.500" >
            Configurar anuncios en Bing
          </Link>
        </ListItem>
      </List.Root>

      <Text>
        Además, puede darse de baja de algunos de estos servicios visitando el portal de exclusión voluntaria de Digital Advertising Alliance en: ttp://optout.aboutads.info/.
      </Text>

      <Heading as="h2" size="lg" mt="8" mb="4" color="gray.800" >
        NO RASTREAR
      </Heading>
      <Text>
        Tenga en cuenta que no alteramos las prácticas de recopilación y uso de datos de nuestro Sitio cuando vemos una señal de No rastrear desde su navegador.
      </Text>

      <Heading as="h2" size="lg" mt="8" mb="4" color="gray.800" >
        SUS DERECHOS
      </Heading>
      <Text mb="4">
        Si usted es un residente europeo, tiene derecho a acceder a la información personal que tenemos sobre usted y a solicitar que su información personal sea corregida, actualizada o eliminada. Si desea ejercer este derecho, comuníquese con nosotros a través de la información de contacto que se encuentra a continuación.
        Además, si usted es un residente europeo, tenemos en cuenta que estamos procesando su información para cumplir con los contratos que podamos tener con usted (por ejemplo, si realiza un pedido a través del Sitio) o para perseguir nuestros intereses comerciales legítimos enumerados anteriormente.  Además, tenga en cuenta que su información se transferirá fuera de Europa, incluidos Canadá y los Estados Unidos.
        <Link href="mailto:busystreetwear@gmail.com" color="blue.500">busystreetwear@gmail.com</Link>.
      </Text>

      <Heading as="h2" size="lg" mt="8" mb="4" color="gray.800" >
        RETENCIÓN DE DATOS
      </Heading>
      <Text>
        Cuando realiza un pedido a través del Sitio, mantendremos su Información del pedido para nuestros registros a menos que y hasta que nos pida que eliminemos esta información.
      </Text>

      <Heading as="h2" size="lg" mt="8" mb="4" color="gray.800" >
        MENORES
      </Heading>
      <Text>
        El sitio no está destinado a personas menores de 18 años.
      </Text>

      <Heading as="h2" size="lg" mt="8" mb="4" color="gray.800" >
        CAMBIOS
      </Heading>
      <Text>
        Podemos actualizar esta política de privacidad periódicamente para reflejar, por ejemplo, cambios en nuestras prácticas o por otros motivos operativos, legales o reglamentarios.
      </Text>

      <Heading as="h2" size="lg" mt="8" mb="4" color="gray.800">
        CONTÁCTENOS
      </Heading>
      <Text mb="4">
        Para obtener más información sobre nuestras prácticas de privacidad, si tiene alguna pregunta o si desea presentar una queja, contáctenos por correo electrónico a busystreetwear@gmail.com o por correo mediante el uso de la información que se proporciona a continuación:
      </Text>
      <Text>
        Busy Streetwear
        M , Mar del plata , B, 7600, Argentina
      </Text>
    </Box>
  );
}
