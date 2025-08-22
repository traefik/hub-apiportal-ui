{pkgs,...}:
let 
  node-modules = pkgs.mkYarnPackage {
    name = "node-modules";
    src = ./.;
    packageJSON = ./package.json;
    yarnLock = ./yarn.lock;
  };
  frontend = pkgs.stdenv.mkDerivation {
    name = "frontend";
    src = ./.;
    buildInputs = [pkgs.yarn node-modules];
    buildPhase = ''
            cp -r ${node-modules}/libexec/portal/node_modules ./
            chmod +w -R ./node_modules

            ${pkgs.yarn}/bin/yarn build --offline
    '';
    installPhase =  ''
          mkdir $out
          mv build $out/lib
    '';
  };
in
  frontend
