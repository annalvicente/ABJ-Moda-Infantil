<?php
// 1. Inicia a sessão na PRIMEIRA linha
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 2. Define resposta em JSON
header('Content-Type: application/json; charset=utf-8');

// 3. Conexão com o Banco de Dados
include 'conexão.php';

if (!isset($conn) && isset($conexao)) {
    $conn = $conexao;
}

$acao = $_GET['acao'] ?? '';

// 4. VERIFICAÇÃO DE LOGIN
if (!isset($_SESSION['cliente_id'])) {
    echo json_encode([
        "sucesso" => false, 
        "mensagem" => "Atenção: Você precisa estar logado para realizar esta ação!"
    ]);
    exit;
}

$id_cliente = intval($_SESSION['cliente_id']);

switch ($acao) {

    // --- 1. ADICIONAR AOS FAVORITOS ---
    case 'adicionar':
        $id_prod = intval($_POST['id_produto'] ?? $_POST['produto_id'] ?? 0);

        if ($id_prod > 0) {
            $check = $conn->query("SELECT id FROM favoritos WHERE id_cliente = $id_cliente AND id_produto = $id_prod");
            
            if ($check && $check->num_rows === 0) {
                $sql = "INSERT INTO favoritos (id_cliente, id_produto) VALUES ($id_cliente, $id_prod)";
                if ($conn->query($sql)) {
                    echo json_encode(["sucesso" => true, "mensagem" => "Adicionado aos favoritos!"]);
                } else {
                    echo json_encode(["sucesso" => false, "mensagem" => "Erro no banco: " . $conn->error]);
                }
            } else {
                echo json_encode(["sucesso" => true, "mensagem" => "Produto já está nos favoritos!"]);
            }
        } else {
            echo json_encode(["sucesso" => false, "mensagem" => "Produto inválido."]);
        }
        break;

    // --- 2. LISTAR FAVORITOS ---
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

        echo json_encode([
            "sucesso" => true, 
            "itens" => $favoritos
        ]);
        break;

    // --- 3. REMOVER DOS FAVORITOS ---
    case 'remover':
        $id_fav = intval($_POST['id_favorito'] ?? 0);   

        if ($id_fav > 0) {
            $sql = "DELETE FROM favoritos WHERE id = $id_fav AND id_cliente = $id_cliente";
            if ($conn->query($sql)) {
                echo json_encode(["sucesso" => true]);
            } else {
                echo json_encode(["sucesso" => false, "mensagem" => $conn->error]);
            }
        }
        break;

    // --- 4. ADICIONAR AO CARRINHO (CORRIGIDO) ---
case 'adicionar_carrinho':
    // 1. Resgata a sessão do cliente logado
    $id_cliente = $_SESSION['id_cliente'] ?? $_SESSION['cliente_id'] ?? 0;

    if ($id_cliente <= 0) {
        http_response_code(401);
        echo json_encode(["status" => "erro", "mensagem" => "Você precisa estar logado para adicionar itens ao carrinho."]);
        break;
    }

    // 2. Aceita tanto 'produto_id' quanto 'id_produto'
    $id_prod = intval($_POST['produto_id'] ?? $_POST['id_produto'] ?? 0);

    if ($id_prod <= 0) {
        echo json_encode(["status" => "erro", "mensagem" => "ID do produto não foi recebido."]);
        break;
    }

    // 3. Verifica se o item já existe no carrinho deste cliente
    $check = $conn->query("SELECT id, quantidade FROM carrinho WHERE id_cliente = $id_cliente AND id_produto = $id_prod");

    if ($check && $check->num_rows > 0) {
        // Se já existe, só aumenta a quantidade
        $sql = "UPDATE carrinho SET quantidade = quantidade + 1 WHERE id_cliente = $id_cliente AND id_produto = $id_prod";
    } else {
        // Se não existe, insere um novo
        $sql = "INSERT INTO carrinho (id_cliente, id_produto, quantidade) VALUES ($id_cliente, $id_prod, 1)";
    }

    // 4. Retorna a chave 'status' exatamente como o JS espera
    if ($conn->query($sql)) {
        echo json_encode(["status" => "sucesso", "mensagem" => "Produto adicionado ao carrinho!"]);
    } else {
        echo json_encode(["status" => "erro", "mensagem" => "Erro no MySQL: " . $conn->error]);
    }
    break;
}

$conn->close();
?>