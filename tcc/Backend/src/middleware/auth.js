import jwt from "jsonwebtoken";

export function autenticar(req, res, next) {

    const token =
        req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({
            mensagem: "Token não informado."
        });
    }

    try {

        req.usuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        next();

    } catch {

        return res.status(401).json({
            mensagem: "Token inválido ou expirado."
        });
    }
}

export function somenteAdmin(req, res, next) {

    if (req.usuario?.tipo !== "admin") {

        return res.status(403).json({
            mensagem:
                "Acesso permitido somente ao administrador."
        });
    }

    next();
}