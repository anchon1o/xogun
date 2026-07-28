# Recursos de marca de Xogún

Esta carpeta agrupa **todos** os elementos gráficos identificativos da aplicación,
para que substituílos polo deseño definitivo sexa tan sinxelo como
sobrescribir estes arquivos (mesmo nome, mesma extensión).

## Arquivos

| Arquivo              | Uso                                                              | Formato recomendado          |
|-----------------------|-------------------------------------------------------------------|-------------------------------|
| `logo.svg`            | Selo/logo principal. Úsase en navbar, login e pantalla de inicio. | SVG con `fill="currentColor"` en todas as paths — así herda automaticamente a cor de acento do tema activo. Se o novo logo non pode ser monocromo, sube unha URL en **Admin → Aparencia** e iso ten prioridade sobre este arquivo. |
| `favicon.png`         | Icona da pestana do navegador.                                    | PNG cadrado, mínimo 180×180px |
| `logo-full.png`       | Versión completa (icona + texto) para usos puntuais.              | PNG con fondo transparente    |

## Como substituír o logo

**Opción rápida (recomendada):** entra en **Admin → Aparencia** e pega a URL
dunha imaxe aloxada externamente (imgur, Supabase Storage, etc.). Isto non
require tocar código nin volver desplegar nada.

**Opción manual:** substitúe `logo.svg` por outro SVG que use `fill="currentColor"`
nas súas formas para que siga adaptándose ao tema claro/escuro e á cor de
acento de cada usuario. Se o teu logo ten cores fixas que non deben cambiar,
substitúe en vez diso `logo-full.png` e usa a opción de Admin → Aparencia.

## Avatares de usuario

Os avatares predefinidos non son arquivos estáticos — xestiónanse desde
**Admin → Avatares**, onde se poden engadir, editar ou desactivar como código
SVG directamente desde a interface, sen tocar arquivos.
