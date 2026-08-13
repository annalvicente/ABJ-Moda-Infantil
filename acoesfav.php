<?php
// 1. Conecta ao banco de dados
include 'conexão.php';

// CORREÇÃO DA VARIÁVEL: Se o seu arquivo conexão.php usa $conexao em vez de $conn
if (!isset($conn) && isset($conexao)) {
    $conn = $conexao;
}

session_start();

header('Content-Type: application/json'); // Define que o arquivo vai retornar dados em JSON
$acao = $_GET['acao'] ?? ''; // Recebe qual ação vai realizar

// VALIDAÇÃO: Bloqueia o acesso se não estiver logado
if (!isset($_SESSION['cliente_id'])) {
    http_response_code(401);
    echo json_encode(["sucesso" => false, "mensagem" => "Faça login para favoritar produtos!"]);
    exit;
}

$id_cliente = $_SESSION['cliente_id']; // ID do cliente logado

switch ($acao) {

    // --- 1. ADICIONAR PRODUTO AOS FAVORITOS ---
    case 'adicionar':
        $id_prod = intval($_POST['id_produto'] ?? 0);

        if ($id_prod > 0) {
            // Verifica se este produto já não está favoritado para não duplicar
            $check = $conn->query("SELECT id FROM favoritos WHERE id_cliente = $id_cliente AND id_produto = $id_prod");
            
            if ($check && $check->num_rows === 0) {
                $sql = "INSERT INTO favoritos (id_cliente, id_produto) VALUES ($id_cliente, $id_prod)";
                if ($conn->query($sql)) {
                    echo json_encode(["sucesso" => true, "mensagem" => "Adicionado aos favoritos!"]);
                } else {
                    echo json_encode(["sucesso" => false, "mensagem" => "Erro no banco de dados.", "detalhe" => $conn->error]);
                }
            } else {
                echo json_encode(["sucesso" => true, "mensagem" => "Produto já está nos favoritos!"]);
            }
        } else {
            echo json_encode(["sucesso" => false, "mensagem" => "Produto inválido."]);
        }
        break;

    // --- 2. LISTAR OS FAVORITOS NA GAVETA/PÁGINA ---
    case 'listar':
        $sql = "SELECT f.id as id_favorito, p.id as id_produto, p.nome, p.preco, p.imagem 
                FROM favoritos f 
                INNER JOIN produtos p ON f.id_produto = p.id 
                WHERE f.id_cliente = $id_cliente";
        
        $resultado = $conn->query($sql);
        $favoritos = [];

        if ($resultado) {
            while ($linha = $resultado->fetch_assoc()) {
                $favoritos[] = $linha;
            }
        }

        // Retorna no formato exato que o seu favoritos.js espera carregar!
        echo json_encode([
            "sucesso" => true, 
            "itens" => $favoritos
        ]);
        break;

    // --- 3. REMOVER UM FAVORITO ---
    case 'remover':
        $id_fav = intval($_POST['id_favorito'] ?? 0);   

        if ($id_fav > 0) {
            $sql = "DELETE FROM favoritos WHERE id = $id_fav AND id_cliente = $id_cliente";
            if ($conn->query($sql)) {
                echo json_encode(["sucesso" => true]);
            } else {
                echo json_encode(["sucesso" => false, "detalhe" => $conn->error]);
            }
        }
        break;

    // --- 4. ADICIONAR PRODUTO DO FAVORITO AO CARRINHO ---
    case 'adicionar_carrinho':
        $id_prod = intval($_POST['produto_id'] ?? 0);

        if ($id_prod > 0) {
            $sql = "INSERT INTO carrinho (id_cliente, id_produto, quantidade) VALUES ($id_cliente, $id_prod, 1)";
            if ($conn->query($sql)) {
                echo json_encode(["sucesso" => true]);
            } else {
                echo json_encode(["sucesso" => false]);
            }
        }
        break;

    default:
        echo json_encode(["sucesso" => false, "mensagem" => "Ação inválida."]);
        break;
}

// Fecha a conexão
$conn->close();
?>