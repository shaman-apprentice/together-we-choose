import { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import { existsSync, statSync } from 'node:fs';
import { getEnv } from '../env.config';
import { ImageService } from 'src/services/image.service';

const languages = [ "en", "de" ] as const;
type Language = typeof languages[number];

export function serveAngularApp(req: Request, res: Response, next: NextFunction) {
  if (req.path.startsWith("/api") || req.path.startsWith(ImageService.serveImagesPath)) {
    next();
    return;
  }

  res.sendFile(parseAngularPath(req), (err) => {
		if (err)
    	console.error("Couldn't serve response:", err);
		
    next();
  });
}

/** returns index.html if given filePath doesNot exist, as the request should be by an Angular's SPA route */
function parseAngularPath(req: Request): string {
	const envConfig = getEnv();
  const i18nPath = getI18nPath(req);
  const staticFilePath = path.join(envConfig.pathToAngularApp, i18nPath);
  if (existsSync(staticFilePath) && statSync(staticFilePath).isFile())
    return staticFilePath;

  const lang = getLanguage(req);
  return path.join(envConfig.pathToAngularApp, lang, "index.html");
}

function getI18nPath(req: Request): string {
  const languageFromUrl = getLanguageFromUrl(req)
  if (languageFromUrl)
    return req.path;

  return `/${getLanguageFromHeader(req)}/${req.path}`;
}

function getLanguage(req: Request): Language {
  return getLanguageFromUrl(req) || getLanguageFromHeader(req);
}

function getLanguageFromHeader(req: Request): Language {
  const acceptedLanguages = req.acceptsLanguages();
  const languageFromHeader = languages.find(l => acceptedLanguages.includes(l));
  if (languageFromHeader)
    return languageFromHeader;

  return languages[0];
}

function getLanguageFromUrl(req: Request): Language | undefined {
  return languages.find(l => req.path.startsWith("/" + l));
}