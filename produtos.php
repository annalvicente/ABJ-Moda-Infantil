<?php
include 'conexão.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: tfuncionarios.php");
    exit();
}

// 1. Capturando e limpando os dados de texto
$id            = trim($_POST['id'] ?? '');
$nome          = trim($_POST['nome'] ?? '');
$id_categoria  = trim($_POST['id_categoria'] ?? '');
$descricao     = trim($_POST['descricao'] ?? '');
$preco         = trim($_POST['preco'] ?? '');
$tamanho       = trim($_POST['tamanho'] ?? '');
$cor           = trim($_POST['cor'] ?? '');
$quantidade    = trim($_POST['quantidade_estoque'] ?? '');
$id_vendedor   = intval($_POST['id_vendedor'] ?? 1);

// 2. Validação obrigatória no Back-end (todos exceto as 2 imagens)
if (
    $nome === '' ||
    $id_categoria === '' ||
    $descricao === '' ||
    $preco === '' || floatval($preco) <= 0 ||
    $tamanho === '' ||
    $cor === '' ||
    $quantidade === '' || intval($quantidade) < 0
) {
    echo "<script>alert('Erro: Preencha todos os campos obrigatórios da peça!'); history.back();</script>";
    exit();
}

$id_categoria_int = intval($id_categoria);
$preco_float      = floatval($preco);
$quantidade_int   = intval($quantidade);

// 3. Lógica para Upload da Imagem 1 (Peça - Opcional)
$imagem1 = !empty($_POST['imagem_atual']) ? $_POST['imagem_atual'] : 'padrao.webp';
if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] === 0) {
    $extensao = pathinfo($_FILES['imagem']['name'], PATHINFO_EXTENSION);
    $novo_nome = md5(uniqid()) . "." . $extensao;
    $destino = "img/" . $novo_nome;
    if (move_uploaded_file($_FILES['imagem']['tmp_name'], $destino)) {
        $imagem1 = $novo_nome;
    }
}

// 4. Lógica para Upload da Imagem 2 (No Corpo - Opcional)
$imagem2 = !empty($_POST['imagem_corpo_atual']) ? $_POST['imagem_corpo_atual'] : 'padrao_corpo.webp';
if (isset($_FILES['imagem_corpo']) && $_FILES['imagem_corpo']['error'] === 0) {
    $extensao_corpo = pathinfo($_FILES['imagem_corpo']['name'], PATHINFO_EXTENSION);
    $novo_nome_corpo = md5(uniqid()) . "_corpo." . $extensao_corpo;
    $destino_corpo = "img/" . $novo_nome_corpo;
    if (move_uploaded_file($_FILES['imagem_corpo']['tmp_name'], $destino_corpo)) {
        $imagem2 = $novo_nome_corpo;
    }
}

// 5. Decisão: INSERT ou UPDATE com Prepared Statement
if (empty($id)) {
    $stmt = $conn->prepare("INSERT INTO produtos (nome, id_categoria, id_vendedor, descricao, preco, tamanho, cor, quantidade_estoque, imagem, imagem_corpo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("siisdssiss", $nome, $id_categoria_int, $id_vendedor, $descricao, $preco_float, $tamanho, $cor, $quantidade_int, $imagem1, $imagem2);
} else {
    $id_int = intval($id);
    $stmt = $conn->prepare("UPDATE produtos SET nome=?, id_categoria=?, id_vendedor=?, descricao=?, preco=?, tamanho=?, cor=?, quantidade_estoque=?, imagem=?, imagem_corpo=? WHERE id=?");
    $stmt->bind_param("siisdssissi", $nome, $id_categoria_int, $id_vendedor, $descricao, $preco_float, $tamanho, $cor, $quantidade_int, $imagem1, $imagem2, $id_int);
}

// 6. Execução e Redirecionamento
if ($stmt->execute()) {
    $acao = empty($id) ? 'cadastrado' : 'editado';
    header("Location: tfuncionarios.php?sucesso=" . $acao);
    exit();
} else {
    echo "Erro ao salvar no banco de dados: " . $stmt->error;
}
?>