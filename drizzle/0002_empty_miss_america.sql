CREATE TABLE `api_consultas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`userId` int NOT NULL,
	`tipoConsulta` enum('cnd_federal','cnd_estadual','regularidade_fgts') NOT NULL,
	`situacao` varchar(100),
	`numeroCertidao` varchar(100),
	`dataEmissao` timestamp,
	`dataValidade` timestamp,
	`respostaCompleta` text,
	`sucesso` boolean NOT NULL DEFAULT true,
	`mensagemErro` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `api_consultas_id` PRIMARY KEY(`id`)
);
