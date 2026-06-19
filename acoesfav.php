    <?php
    // 1. Conecta ao banco de dados
    // include 'conexão.php';

    // session_start();

    // $id_cliente = $_SESSION['cliente_id']; //qual cliente esta favoritando

    // header('Content-Type: application/json');       //mostra que essa pagina não deve ser exposta, e serve apenas para entregar dados

    // $acao = $_GET['acao'] ?? '';        //recebe qual ação vai realizar

// 1. Conecta ao banco de dados
include 'conexão.php';

// CORREÇÃO DA VARIÁVEL: Se o seu arquivo conexão.php usa $conexao em vez de $conn,
// criamos esse atalho abaixo para você não ter que mudar o código todo:
if (!isset($conn) && isset($conexao)) {
    $conn = $conexao;
}

session_start();

header('Content-Type: application/json'); // Mostra que essa página serve para entregar dados
$acao = $_GET['acao'] ?? ''; // Recebe qual ação vai realizar

// VALIDAÇÃO: Bloqueia o "adicionar_carrinho" e "remover" se não estiver logado
if (($acao === 'adicionar_carrinho' || $acao === 'remover' || $acao === 'listar') && !isset($_SESSION['cliente_id'])) {
    http_response_code(401); // Código HTTP de Não Autorizado
    echo json_encode(["status" => "erro", "mensagem" => "Usuário não logado."]);
    exit;
}

$id_cliente = $_SESSION['cliente_id'] ?? null; // Qual cliente está favoritando

    switch ($acao) {
        
        case 'listar':
           
            // Pegamos os dados do produto que o cliente favoritou
            $sql = "SELECT f.id as id_favorito, p.id as id_produto, p.nome, p.preco, p.imagem 
                    FROM favoritos f 
                    INNER JOIN produtos p ON f.id_produto = p.id 
                    WHERE f.id_cliente = $id_cliente";
            
            $resultado = $conn->query($sql);
            $favoritos = [];

            while ($linha = $resultado->fetch_assoc()) {
                $favoritos[] = $linha;
            }

            echo json_encode($favoritos);
            break;

        case 'remover':
            // Recebe o ID do favorito enviado pelo FormData do JS
            $id_fav = $_POST['id_favorito'] ?? 0;   

            if ($id_fav > 0) {
                $sql = "DELETE FROM favoritos WHERE id = $id_fav AND id_cliente = $id_cliente";
                if ($conn->query($sql)) {
                    echo json_encode(["status" => "sucesso"]);
                } else {
                    echo json_encode(["status" => "erro", "detalhe" => $conn->error]);
                }
            }
            break;

        case 'adicionar_carrinho':
            // Recebe o ID do produto para colocar na tabela carrinho
            $id_prod = $_POST['produto_id'] ?? 0;

            if ($id_prod > 0) {
                $sql = "INSERT INTO carrinho (id_cliente, id_produto, quantidade) VALUES ($id_cliente, $id_prod, 1)";
                if ($conn->query($sql)) {
                    echo json_encode(["status" => "sucesso"]);
                } else {
                    echo json_encode(["status" => "erro"]);
                }
            }
            break;

        default:
            echo json_encode(["status" => "acao_invalida"]);
            break;
    }

    // Fecha a conexão para não gastar recursos
    $conn->close();
    ?>