import { Card } from "antd"
import { Link } from "react-router-dom";
import "../css/book.css"

const { Meta } = Card;

export default function Book_card({ book }) {
    return <Link to={`/book/${book.id}`}>
        <Card
            hoverable
            className="book-card"
            cover={
                <img
                    alt={book.title}
                    src={book.cover}
                    className="book-cover"
                />
            }
        >
            <Meta title={book.title} description={`${book.price / 100}元`} />
        </Card>
    </Link>
}