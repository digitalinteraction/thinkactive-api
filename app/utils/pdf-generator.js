const path = require('path');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const qr = require('qr-image');
const SVGtoPDF = require('svg-to-pdfkit');
const { DOMParser } = require('xmldom');

// PDFDocument.prototype.addSVG = (svg, x, y, options) => SVGtoPDF(this, svg, x, y, options);
PDFDocument.prototype.addSVG = function (svg, x, y, options) {
  return SVGtoPDF(this, svg, x, y, options), this;
};

const mmToPt = 2.83464388369;

function parseXml(xml) {
  try {
    return new DOMParser().parseFromString(xml, 'text/xml');
  }
  catch (e) {
    return null;
  }
}

class BaseSheet {
  constructor(doc, page, columns, rows) {
    this._doc = doc;
    this._page = page;
    this._columns = columns;
    this._rows = rows;
  }

  get doc() {
    return this._doc;
  }

  set doc(doc) {
    this._doc = doc;
  }

  get page() {
    return this._page;
  }

  set page(page) {
    this._page = page;
  }

  get columns() {
    return this._columns;
  }

  set columns(columns) {
    this._columns = columns;
  }

  get rows() {
    return this._rows;
  }

  set rows(rows) {
    this._rows = rows;
  }

  drawPageTitle(title, instruction, x, y) {
    const fontBuffer = fs.readFileSync(path.join(__dirname, '../public', 'images', 'StantonICG.ttf'));
    this._doc.font(fontBuffer);
    this._doc.fontSize(16);
    this._doc.text(
      title,
      x,
      (this._page.margin.y / 2),
      {
        width: this._doc.page.width,
        height: 16,
        align: 'center'
      }
    );

    this._doc.fontSize(12);
    this._doc.text(
      instruction,
      x,
      (this._page.margin.y),
      {
        width: this._doc.page.width,
        height: 16,
        align: 'center'
      }
    );
  }
}

class AvatarLabelSheet extends BaseSheet {
  constructor(doc, page, columns, rows, sticker, avatar, qrCode) {
    super(doc, page, columns, rows);
    this._sticker = sticker;
    this._avatar = avatar;
    this._qrCode = qrCode;
  }

  get sticker() {
    return this._sticker;
  }

  set sticker(sticker) {
    this._sticker = sticker;
  }

  get avatar() {
    return this._avatar;
  }

  set avatar(avatar) {
    this._avatar = avatar;
  }

  get qrCode() {
    return this._qrCode;
  }

  set qrCode(qrCode) {
    this._qrCode = qrCode;
  }

  drawQRCode(deployemntUser, x, y) {
    const url = `https://thinkactive.io/deploymentUser/${deployemntUser.id}`;

    const qrCodeImg = qr.imageSync(
      url,
      {
        type: 'png',
        ec_level: 'L',
        options: {
          parse_url: true,
          ec_level: 'L',
          margin: -1
        }
      }
    );

    this._doc.image(qrCodeImg, x, y, { fit: [this._qrCode.width, this._qrCode.height] });
  }

  drawAvatar(deploymentUser, x, y) {
    const filename = `${path.join(__dirname, '../public', 'images', 'avatars', `${deploymentUser.animal}.svg`)}`;
    const svgString = fs.readFileSync(filename).toString().replace('<svg', `<svg fill="${deploymentUser.colour}"`);
    const viewBox = parseXml(svgString).documentElement.getAttribute('viewBox').split(' ');

    const fontBuffer = fs.readFileSync(path.join(__dirname, '../public', 'images', 'StantonICG.ttf'));
    this._doc.font(fontBuffer);
    this._doc.fontSize(16);
    this._doc.text(
      `${deploymentUser.colour.replace(/^\w/, c => c.toUpperCase())} ${deploymentUser.animal.replace(/^\w/, c => c.toUpperCase())}`,
      x - ((this._sticker.width - this._avatar.width) / 2),
      y + this._avatar.height + this._sticker.textPadding.y + this._sticker.textPadding.y,
      {
        width: this._sticker.width,
        align: 'center'
      }
    );
    this._doc.addSVG(svgString, x, y, {
      width: this._avatar.width,
      height: this._avatar.height
    });
  }
}

class CribSheet extends BaseSheet {
  constructor(doc, page, columns, rows, avatar, avatarBox) {
    super(doc, page, columns, rows);
    this._avatar = avatar;
    this._avatarBox = avatarBox;
  }

  get avatar() {
    return this._avatar;
  }

  set avatar(avatar) {
    this._avatar = avatar;
  }

  get avatarBox() {
    return this._avatarBox;
  }

  set avatarBox(avatarBox) {
    this._avatarBox = avatarBox;
  }

  drawAvatar(deploymentUser, x, y) {
    const filename = `${path.join(__dirname, '../public', 'images', 'avatars', `${deploymentUser.animal}.svg`)}`;
    const svgString = fs.readFileSync(filename).toString().replace('<svg', `<svg fill="${deploymentUser.colour}"`);
    const viewBox = parseXml(svgString).documentElement.getAttribute('viewBox').split(' ');

    const fontBuffer = fs.readFileSync(path.join(__dirname, '../public', 'images', 'StantonICG.ttf'));
    this._doc.font(fontBuffer);
    this._doc.fontSize(16);
    this._doc.text(
      `${deploymentUser.colour.replace(/^\w/, c => c.toUpperCase())} ${deploymentUser.animal.replace(/^\w/, c => c.toUpperCase())}`,
      // x - ((this._avatarBox.width - this._avatar.width) / 2),
      x + this.avatar.width + (this.avatarBox.avatarPadding.x * 2),
      // y + this._avatar.height + this._avatarBox.textPadding.y + this._avatarBox.textPadding.y,
      y + this.avatarBox.avatarPadding.y,
      {
        width: this._avatarBox.width,
        height: this._avatarBox.height,
        align: 'left'
      }
    );
    this._doc.addSVG(svgString, x + this._avatarBox.avatarPadding.x, y, {
      width: this._avatar.width,
      height: this._avatar.height
    });
  }
}

class ChargingDocSheet extends BaseSheet {
  constructor(doc, page, columns, rows, avatar, stickerBox) {
    super(doc, page, columns, rows);
    this._avatar = avatar;
    this._stickerBox = stickerBox;
  }

  get avatar() {
    return this._avatar;
  }

  set avatar(avatar) {
    this._avatar = avatar;
  }

  get stickerBox() {
    return this._stickerBox;
  }

  set stickerBox(stickerBox) {
    this._stickerBox = stickerBox;
  }

  drawAvatar(deploymentUser, x, y) {
    const filename = `${path.join(__dirname, '../public', 'images', 'avatars', `${deploymentUser.animal}.svg`)}`;
    const svgString = fs.readFileSync(filename).toString().replace('<svg', `<svg fill="${deploymentUser.colour}"`);
    const viewBox = parseXml(svgString).documentElement.getAttribute('viewBox').split(' ');

    this._doc.addSVG(svgString, x, y, {
      width: (this._avatar.width - this._stickerBox.avatarPadding.x),
      height: (this._avatar.width - this._stickerBox.avatarPadding.y)
    });
  }
}

class InfoBookletSheet extends BaseSheet {
  constructor(doc, page, columns, rows, sticker, avatar) {
    super(doc, page, columns, rows);
    this._sticker = sticker;
    this._avatar = avatar;
  }

  get sticker() {
    return this._sticker;
  }

  set sticker(sticker) {
    this._sticker = sticker;
  }

  get avatar() {
    return this._avatar;
  }

  set avatar(avatar) {
    this._avatar = avatar;
  }

  drawAvatar(deploymentUser, x, y) {
    const filename = `${path.join(__dirname, '../public', 'images', 'avatars', `${deploymentUser.animal}.svg`)}`;
    const svgString = fs.readFileSync(filename).toString().replace('<svg', `<svg fill="${deploymentUser.colour}"`);
    const viewBox = parseXml(svgString).documentElement.getAttribute('viewBox').split(' ');

    const fontBuffer = fs.readFileSync(path.join(__dirname, '../public', 'images', 'StantonICG.ttf'));
    this._doc.font(fontBuffer);
    this._doc.fontSize(18);
    this._doc.text(
      `${deploymentUser.colour.replace(/^\w/, c => c.toUpperCase())} ${deploymentUser.animal.replace(/^\w/, c => c.toUpperCase())}`,
      x - ((this._sticker.width - this._avatar.width) / 2),
      y + this._avatar.height + this._sticker.textPadding.y + this._sticker.textPadding.y,
      {
        width: this._sticker.width,
        align: 'center'
      }
    );
    this._doc.addSVG(svgString, x, y, {
      width: this._avatar.width,
      height: this._avatar.height
    });
  }
}

module.exports = {
  drawAvatarLabelSheet: (deploymentUsers) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }
    });

    // set up page
    const page = {
      width: 210 * mmToPt,
      height: 297 * mmToPt,
      margin: {
        y: 16 * mmToPt,
        x: 4.5 * mmToPt,
        innerColumn: {
          x: 3 * mmToPt,
          y: 2 * mmToPt
        }
      },
      maxColumns: 3,
      maxRows: 4
    };
    // measurements in mm
    const sticker = {
      width: 65 * mmToPt,
      height: 65 * mmToPt,
      margin: {
        x: 3 * mmToPt,
        y: 3 * mmToPt
      },
      avatarPadding: {
        x: 35 * mmToPt,
        y: 15 * mmToPt
      },
      qrCodePadding: {
        x: 35 * mmToPt,
        y: 35 * mmToPt
      },
      textPadding: {
        x: 20 * mmToPt,
        y: 1 * mmToPt
      }
    };

    const columns = [
      {
        x: page.margin.x,
        y: page.margin.y
      },
      {
        x: (page.margin.x + sticker.width + page.margin.innerColumn.x),
        y: page.margin.y
      },
      {
        x: (page.margin.x + sticker.width
          + page.margin.innerColumn.x
          + sticker.width
          + page.margin.innerColumn.x),
        y: page.margin.y
      }
    ];

    const rows = [];

    for (let pageRows = 0; pageRows < page.maxRows; pageRows += 1) {
      rows.push({
        x: columns[0].x,
        y: columns[0].y + (sticker.height * pageRows) + (page.margin.innerColumn.y * pageRows)
      });
    }

    const avatar = {
      width: (sticker.width - sticker.margin.x) - (42 * mmToPt),
      height: (sticker.width - sticker.margin.y) - (42 * mmToPt)
    };

    const qrCode = {
      width: sticker.width - sticker.qrCodePadding.x,
      height: sticker.height - sticker.qrCodePadding.y
    };

    // constructor(page, columns, rows, avatar, qrCode) {
    const avatarLabelSheet = new AvatarLabelSheet(doc, page, columns, rows, sticker, avatar, qrCode);

    let deploymentUserIndex = 0;

    const pagesRequired = Math.ceil(deploymentUsers.length / (avatarLabelSheet.page.maxRows * avatarLabelSheet.page.maxColumns));

    for (let pageCounter = 0; pageCounter < pagesRequired; pageCounter += 1) {
      for (let rowIndex = 0; rowIndex < page.maxRows; rowIndex += 1) {
        if (deploymentUserIndex % (avatarLabelSheet.page.maxRows * avatarLabelSheet.page.maxColumns) === 0 && deploymentUserIndex !== 0) {
          avatarLabelSheet.doc.addPage();
          rowIndex = 0;
        }

        for (let columnIndex = 0; columnIndex < avatarLabelSheet.page.maxColumns; columnIndex += 1) {
          if (deploymentUserIndex < deploymentUsers.length) {
            avatarLabelSheet.drawQRCode(
              deploymentUsers[deploymentUserIndex],
              avatarLabelSheet.columns[columnIndex].x + ((avatarLabelSheet.sticker.width - avatarLabelSheet.qrCode.width) / 2),
              avatarLabelSheet.rows[rowIndex].y + (avatarLabelSheet.sticker.margin.y)
            );

            avatarLabelSheet.drawAvatar(
              deploymentUsers[deploymentUserIndex],
              avatarLabelSheet.columns[columnIndex].x + ((avatarLabelSheet.sticker.width - avatarLabelSheet.avatar.width) / 2),
              avatarLabelSheet.rows[rowIndex].y + avatarLabelSheet.sticker.margin.y + avatarLabelSheet.qrCode.height
            );
          }

          deploymentUserIndex += 1;
        }
      }
    }

    return avatarLabelSheet.doc;
  },

  drawTeacherCribSheet: (deploymentUsers) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }
    });

    // set up page
    const page = {
      width: 210 * mmToPt,
      height: 297 * mmToPt,
      margin: {
        y: 16 * mmToPt,
        x: 16 * mmToPt,
        innerColumn: {
          x: 10 * mmToPt,
          y: 5 * mmToPt
        }
      },
      maxColumns: 2,
      maxRows: 18
    };

    const avatarBox = {
      width: (((page.width - (page.margin.x * 2)) - page.margin.innerColumn.x) / page.maxColumns),
      height: (page.height - (page.margin.y * 2) - (page.margin.innerColumn.y * page.maxRows)) / page.maxRows,
      margin: {
        x: 5 * mmToPt,
        y: 5 * mmToPt
      },
      avatarPadding: {
        x: 2 * mmToPt,
        y: 2 * mmToPt
      },
      textPadding: {
        x: 20 * mmToPt,
        y: 1 * mmToPt
      }
    };

    const columns = [
      {
        x: page.margin.x,
        y: page.margin.y
      },
      {
        x: (page.margin.x + avatarBox.width + page.margin.innerColumn.x),
        y: page.margin.y
      }
    ];

    const rows = [];

    for (let pageRows = 0; pageRows < page.maxRows; pageRows += 1) {
      rows.push({
        x: columns[0].x,
        y: columns[0].y + (avatarBox.height * pageRows) + (page.margin.innerColumn.y * pageRows)
      });
    }

    const avatar = {
      width: avatarBox.width * 0.10,
      height: avatarBox.height
    };

    // constructor(page, columns, rows, avatar, qrCode) {
    const cribSheet = new CribSheet(doc, page, columns, rows, avatar, avatarBox);

    let deploymentUserIndex = 0;

    const pagesRequired = Math.ceil(deploymentUsers.length / (cribSheet.page.maxRows * cribSheet.page.maxColumns));

    cribSheet.drawPageTitle('Student lookup sheet', 'Use this sheet to write down the student\'s name and their associated avatar. Only you as the teacher have this information.', 0, 0);

    for (let pageCounter = 0; pageCounter < pagesRequired; pageCounter += 1) {
      for (let rowIndex = 0; rowIndex < cribSheet.page.maxRows; rowIndex += 1) {
        if (deploymentUserIndex % (cribSheet.page.maxRows * cribSheet.page.maxColumns) === 0 && deploymentUserIndex !== 0) {
          cribSheet.doc.addPage();
          rowIndex = 0;
        }

        for (let columnIndex = 0; columnIndex < cribSheet.page.maxColumns; columnIndex += 1) {
          if (deploymentUserIndex < deploymentUsers.length) {
            cribSheet.doc.rect(
              cribSheet.columns[columnIndex].x,
              cribSheet.rows[rowIndex].y + (cribSheet.page.margin.y / 2),
              cribSheet.avatarBox.width,
              cribSheet.avatarBox.height
            ).stroke('grey');
            cribSheet.drawAvatar(
              deploymentUsers[deploymentUserIndex],
              cribSheet.columns[columnIndex].x,
              cribSheet.rows[rowIndex].y + (cribSheet.page.margin.y / 2),
            );
          }

          deploymentUserIndex += 1;
        }
      }
    }

    return cribSheet.doc;
  },

  drawChargingDockSheet: (deploymentUsers) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }
    });

    // set up page
    const page = {
      width: 210 * mmToPt,
      height: 297 * mmToPt,
      margin: {
        y: 14 * mmToPt,
        x: 12 * mmToPt,
        innerColumn: {
          x: 2 * mmToPt,
          y: 2 * mmToPt
        }
      },
      maxColumns: 9,
      maxRows: 13
    };

    const stickerBox = {
      width: 19 * mmToPt,
      height: 19 * mmToPt,
      margin: {
        x: 0 * mmToPt,
        y: 0 * mmToPt
      },
      avatarPadding: {
        x: 8 * mmToPt,
        y: 8 * mmToPt
      }
    };

    const columns = [];

    for (let pageColumns = 0; pageColumns < page.maxColumns; pageColumns += 1) {
      columns.push({
        x:
          page.margin.x
          + (stickerBox.width * pageColumns)
          + (page.margin.innerColumn.x * pageColumns),
        y:
          page.margin.y
          + (stickerBox.height * pageColumns)
          + (page.margin.innerColumn.y * pageColumns)
      });
    }

    const rows = [];

    for (let pageRows = 0; pageRows <= page.maxRows; pageRows += 1) {
      rows.push({
        x: columns[0].x,
        y: columns[0].y + (stickerBox.height * pageRows) + (page.margin.innerColumn.y * pageRows)
      });
    }

    const avatar = {
      width: stickerBox.width,
      height: stickerBox.height
    };

    // constructor(page, columns, rows, avatar, qrCode) {
    const chargingDocSheet = new ChargingDocSheet(doc, page, columns, rows, avatar, stickerBox);

    let deploymentUserIndex = 0;

    const pagesRequired = Math.ceil(deploymentUsers.length / (chargingDocSheet.page.maxRows * chargingDocSheet.page.maxColumns));
    for (let pageCounter = 0; pageCounter < pagesRequired; pageCounter += 1) {
      for (let rowIndex = 0; rowIndex < chargingDocSheet.page.maxRows; rowIndex += 1) {
        if (deploymentUserIndex % (chargingDocSheet.page.maxRows * chargingDocSheet.page.maxColumns) === 0 && deploymentUserIndex !== 0) {
          chargingDocSheet.doc.addPage();
          rowIndex = 0;
        }

        for (let columnIndex = 0; columnIndex < chargingDocSheet.page.maxColumns; columnIndex += 1) {
          if (deploymentUserIndex < deploymentUsers.length) {
            chargingDocSheet.drawAvatar(
              deploymentUsers[deploymentUserIndex],
              chargingDocSheet.columns[columnIndex].x + (chargingDocSheet.stickerBox.avatarPadding.x / 2),
              chargingDocSheet.rows[rowIndex].y + (chargingDocSheet.stickerBox.avatarPadding.y / 2),
            );
          }

          deploymentUserIndex += 1;
        }
      }
    }

    return chargingDocSheet.doc;
  },

  drawInfoBookletLabelSheet: (deploymentUsers) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }
    });

    // set up page
    const page = {
      width: 210 * mmToPt,
      height: 297 * mmToPt,
      margin: {
        y: 16 * mmToPt,
        x: 4.5 * mmToPt,
        innerColumn: {
          x: 3 * mmToPt,
          y: 2 * mmToPt
        }
      },
      maxColumns: 3,
      maxRows: 4
    };
    // measurements in mm
    const sticker = {
      width: 65 * mmToPt,
      height: 65 * mmToPt,
      margin: {
        x: 3 * mmToPt,
        y: 3 * mmToPt
      },
      avatarPadding: {
        x: 5 * mmToPt,
        y: 5 * mmToPt
      },
      textPadding: {
        x: 20 * mmToPt,
        y: 1 * mmToPt
      }
    };

    const columns = [
      {
        x: page.margin.x,
        y: page.margin.y
      },
      {
        x: (page.margin.x + sticker.width + page.margin.innerColumn.x),
        y: page.margin.y
      },
      {
        x: (page.margin.x + sticker.width
          + page.margin.innerColumn.x
          + sticker.width
          + page.margin.innerColumn.x),
        y: page.margin.y
      }
    ];

    const rows = [];

    for (let pageRows = 0; pageRows < page.maxRows; pageRows += 1) {
      rows.push({
        x: columns[0].x,
        y: columns[0].y + (sticker.height * pageRows) + (page.margin.innerColumn.y * pageRows)
      });
    }

    const avatar = {
      width: (sticker.width - sticker.margin.x),
      height: (sticker.width - sticker.margin.y) - (12 * mmToPt)
    };

    // constructor(page, columns, rows, avatar, qrCode) {
    const infoBookletSheet = new InfoBookletSheet(doc, page, columns, rows, sticker, avatar);

    let deploymentUserIndex = 0;

    const pagesRequired = Math.ceil(deploymentUsers.length / (infoBookletSheet.page.maxRows * infoBookletSheet.page.maxColumns));

    for (let pageCounter = 0; pageCounter < pagesRequired; pageCounter += 1) {
      for (let rowIndex = 0; rowIndex < page.maxRows; rowIndex += 1) {
        if (deploymentUserIndex % (infoBookletSheet.page.maxRows * infoBookletSheet.page.maxColumns) === 0 && deploymentUserIndex !== 0) {
          infoBookletSheet.doc.addPage();
          rowIndex = 0;
        }

        for (let columnIndex = 0; columnIndex < infoBookletSheet.page.maxColumns; columnIndex += 1) {
          if (deploymentUserIndex < deploymentUsers.length) {
            infoBookletSheet.drawAvatar(
              deploymentUsers[deploymentUserIndex],
              infoBookletSheet.columns[columnIndex].x + ((infoBookletSheet.sticker.width - infoBookletSheet.avatar.width) / 2),
              infoBookletSheet.rows[rowIndex].y + infoBookletSheet.sticker.margin.y
            );
          }

          deploymentUserIndex += 1;
        }
      }
    }

    return infoBookletSheet.doc;
  },
};
