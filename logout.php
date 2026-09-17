<?php
// 1. Inicia a sessão para que o PHP saiba qual é a sessão que deve ser encerrada
session_start();

// 2. Remove todas as variáveis de sessão (apaga o nome, id, tipo de utilizador, etc.)
session_unset();

// 3. Destrói completamente a sessão ativa no servidor
session_destroy();

// 4. Redireciona o utilizador de volta para a página principal (agora já deslogado)
header("Location: index.php");
exit();
?>