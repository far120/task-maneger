export default function Today()
{
    console.log('today');
    return(
        <div>
            Today's Date: {new Date().toLocaleDateString()}
        </div>
    )
}