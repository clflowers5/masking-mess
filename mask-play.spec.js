import { doIt, findFirstDifferentCharacterIndex } from './mask-play';

const maskNumber = x =>
  x
    .toString()
    .replace(',', '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

describe('firstDifferentCharacterIndex', () => {
  it("does it's job", () => {
    expect(findFirstDifferentCharacterIndex('12345', '1245')).toEqual(2);
    expect(findFirstDifferentCharacterIndex('1234', '1234')).toEqual(-1);
    expect(findFirstDifferentCharacterIndex('1', '0')).toEqual(0);
  });
});

describe('doIt', () => {
  it('multi deletion on delimiter', () => {
    // todo: real one here
    // expect(
    //   doIt({
    //     val: '1245',
    //     prev: '12,345',
    //     mask: maskNumber,
    //     currentCursor: 2,
    //     delimiter: ','
    //   })
    // ).toEqual({
    //   newValue: '1,245',
    //   cursor: 3
    // });
  });

  it('single deletion on delimter', () => {
    expect(
      doIt({
        val: '12345',
        prev: '12,345',
        mask: maskNumber,
        currentCursor: 2,
        delimiter: ','
      })
    ).toEqual({
      newValue: '1,345',
      cursor: 1
    });
  });

  it('single deletion non delimiter', () => {
    expect(
      doIt({
        val: '12,45',
        prev: '12,345',
        mask: maskNumber,
        currentCursor: 3,
        delimiter: ','
      })
    ).toEqual({
      newValue: '1,245',
      cursor: 3
    });
  });

  it('multi deletion without delimiter', () => {
    expect(
      doIt({
        val: ',345',
        prev: '12,345',
        mask: maskNumber,
        currentCursor: 0,
        delimiter: ','
      })
    ).toEqual({
      newValue: '345',
      cursor: 0
    });

    expect(
      doIt({
        val: '12,',
        prev: '12,345',
        mask: maskNumber,
        currentCursor: 3,
        delimiter: ','
      })
    ).toEqual({
      newValue: '12',
      cursor: 2
    });

    expect(
      doIt({
        val: '12,5',
        prev: '12,345',
        mask: maskNumber,
        currentCursor: 3,
        delimiter: ','
      })
    ).toEqual({
      newValue: '125',
      cursor: 2
    });
  });

  it('multi deletion with delimiter', () => {
    // 2 scnearios could do this, replace with 2 or only select comman and 3
    // expect(
    //   doIt({
    //     val: '1245',
    //     prev: '12,345',
    //     mask: maskNumber,
    //     currentCursor: 2,
    //     delimiter: ','
    //   })
    // ).toEqual({
    //   newValue: '1,245',
    //   cursor: 3
    // })
  });

  it('multi deletion with replacement non delimiter', () => {});

  it('multi deletion with replacement on delimiter', () => {
    // todo: this is the crap.
    expect(
      doIt({
        val: '1845',
        prev: '12,345',
        mask: maskNumber,
        currentCursor: 2,
        delimiter: ','
      })
    ).toEqual({
      newValue: '1,845',
      cursor: 3
    });

    // this was Ronnie's exact scenario -- woo
    expect(
      doIt({
        val: '1245',
        prev: '12,345',
        mask: maskNumber,
        currentCursor: 2,
        delimiter: ','
      })
    ).toEqual({
      newValue: '1,245',
      cursor: 3
    });

    // this would be a copy paste scenario
    expect(
      doIt({
        val: '123,456999',
        prev: '123,456,789',
        mask: maskNumber,
        currentCursor: 10,
        delimiter: ','
      })
    ).toEqual({
      newValue: '123,456,999',
      cursor: 11
    });
  });
});
