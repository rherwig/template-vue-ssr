import express from 'express';
import people from './people.json';

const router = express.Router();

function* skipN(n, iterable) {
    let i = 0;

    for (let item of iterable) {
        if (i >= n) {
            yield item;
        }

        i++;
    }
}

function* takeN(n, iterable) {
    let i = 0;

    for (let item of iterable) {
        if (i === n) {
            return;
        }

        i++;

        yield item;
    }
}

router.get('/people', (req, res) => {
    const { skip, take } = req.query;
    const _take = parseInt(take || 12, 10);
    let _people = [...people];

    if (skip) {
        _people = [
            ...takeN(_take, skipN(parseInt(skip, 10), people)),
        ];
    }

    const data = {
        skip,
        take: _take,
        pages: Math.floor(people.length / _take),
        people: _people,
    };

    return res.json(data).end();
});

export default router;
